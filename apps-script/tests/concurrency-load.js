// Deterministic multi-runtime stress check for the production saveTransaction/locked_ path.
// The spreadsheet is an in-memory stand-in, so this checks locking and oversell safety,
// not Google Sheets service latency or Apps Script quotas.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const code = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
const CLIENT_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1];
const SLOT_BASE = 10;
const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * (SLOT_BASE + 10));
const shared = new Int32Array(sharedBuffer);
shared[3] = 8; // Eight units available; 10 unique requests race for them.
const delayBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);

const workerSource = String.raw`
const { parentPort, workerData } = require('node:worker_threads');
const vm = require('node:vm');
const shared = new Int32Array(workerData.sharedBuffer);
const SLOT_BASE = 10;
function updateMax(value) {
  while (true) {
    const old = Atomics.load(shared, 2);
    if (old >= value || Atomics.compareExchange(shared, 2, old, value) === old) return;
  }
}
const lockService = {
  getScriptLock() {
    return {
      waitLock(timeoutMs) {
        const end = Date.now() + timeoutMs;
        while (Atomics.compareExchange(shared, 0, 0, 1) !== 0) {
          const remaining = end - Date.now();
          if (remaining <= 0) throw new Error('Lock timeout');
          Atomics.wait(shared, 0, 1, remaining);
        }
        updateMax(Atomics.add(shared, 1, 1) + 1);
      },
      tryLock(timeoutMs) {
        try { this.waitLock(timeoutMs); return true; } catch (e) { return false; }
      },
      releaseLock() {
        Atomics.sub(shared, 1, 1);
        Atomics.store(shared, 0, 0);
        Atomics.notify(shared, 0, 1);
      }
    };
  }
};
const context = vm.createContext({
  LockService: lockService,
  shared,
  requestIndex: workerData.requestIndex,
  delayBuffer: new Int32Array(workerData.delayBuffer),
});
vm.runInContext(workerData.code, context, { filename: 'Code.gs' });
const patchCode = [
  "auth_ = function(){ return {email:'worker@example.test',name:'동시작업자',admin:false}; };",
  "state_ = function(){ Atomics.wait(delayBuffer,0,0,12); const logs=[]; for(let i=0;i<10;i++) if(Atomics.load(shared,10+i)===1){ const row=[]; row[1]='request-'+String(i).padStart(8,'0'); row[2]='ITEM1'; row[4]='출고'; row[5]=1; row[9]=Atomics.load(shared,3); row[11]='same-signature'; row[13]=0; logs.push(row); } return {items:[{code:'ITEM1',active:true,stock:Atomics.load(shared,3),hasLength:false,lengths:[],unit:'EA',baseLength:0}],logs:logs,directAliases:{},aliases:{}}; };",
  "signature_ = function(){ return 'same-signature'; };",
  "workDate_ = function(){ return ''; };",
  "lkKind_ = function(){ return ''; };",
  "append_ = function(s,u,id,item,type,quantity,delta){ const next=Atomics.load(shared,3)+delta; if(next<0) fail_('재고 부족'); Atomics.store(shared,3,next); const index=Number(id.slice('request-'.length)); Atomics.store(shared,10+index,1); Atomics.add(shared,4,1); return {ok:true,duplicate:false,code:item.code,type:type,quantity:quantity,stock:next,currentStock:next,length:0,lengthStock:next,lengths:[]}; };"
].join('\n');
vm.runInContext(patchCode, context);
const requestId = 'request-' + String(workerData.requestIndex).padStart(8, '0');
try {
  const payload = {requestId, code:'ITEM1', type:'출고', quantity:1, memo:'stress'};
  context.payload = payload;
  const result = vm.runInContext('saveTransaction(payload, "test-token")', context);
  parentPort.postMessage({ok:true,result});
} catch (error) {
  parentPort.postMessage({ok:false,error:String(error && error.message || error)});
}
`;

function runWorker(requestIndex) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerSource, {
      eval: true,
      workerData: { code, sharedBuffer, delayBuffer, requestIndex },
    });
    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (status) => {
      if (status !== 0) reject(new Error('worker exit status ' + status));
    });
  });
}

(async () => {
  const startedAt = Date.now();
  const results = await Promise.all(CLIENT_IDS.map(runWorker));
  const ok = results.filter((entry) => entry.ok);
  const failures = results.filter((entry) => !entry.ok);
  const duplicates = ok.filter((entry) => entry.result && entry.result.duplicate);
  const created = Atomics.load(shared, 4);
  const finalStock = Atomics.load(shared, 3);
  const maxConcurrentInsideLock = Atomics.load(shared, 2);

  assert.equal(ok.length, 10, '8 unique saves plus 2 idempotent retries should succeed');
  assert.equal(failures.length, 2, 'two unique out-of-stock requests should be rejected');
  assert.equal(duplicates.length, 2, 'the repeated request IDs should return duplicate results');
  assert.equal(created, 8, 'only unique, valid requests should append records');
  assert.equal(finalStock, 0, 'inventory must not become negative or lose decrements');
  assert.equal(maxConcurrentInsideLock, 1, 'the script lock must serialize all writers');

  console.log(JSON.stringify({
    virtualConcurrentUsers: CLIENT_IDS.length,
    uniqueRequests: 10,
    duplicateRetries: duplicates.length,
    acceptedUniqueWrites: created,
    rejectedForInsufficientStock: failures.length,
    startingStock: 8,
    finalStock,
    maximumWritersInsideLock: maxConcurrentInsideLock,
    simulatedReadDelayMs: 12,
    elapsedMs: Date.now() - startedAt,
    result: 'PASS',
    note: 'In-memory concurrency test; does not measure Google Sheets latency or Apps Script quotas.',
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
