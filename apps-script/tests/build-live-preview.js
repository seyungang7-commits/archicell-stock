// Build a local-only visual preview of the Apps Script HTML with a mocked dashboard.
// It deliberately uses example data and never connects to Google Sheets.
const fs = require('node:fs');
const path = require('node:path');

const sourcePath = path.join(__dirname, '..', 'Index.html');
const outputPath = process.argv[2] || path.join(__dirname, 'live-sync-preview.html');
let html = fs.readFileSync(sourcePath, 'utf8');
html = html
  .replace("<?!= include_('QRLib'); ?>", '')
  .replace(/<\?=\s*initialSku\s*\?>/g, '')
  .replace(/<\?=\s*initialAction\s*\?>/g, '')
  .replace('<title>ARCHICELL 재고관리</title>', '<title>ARCHICELL 재고관리 · 미리보기</title>');

const mock = String.raw`window.google={script:{run:{
  _ok:null,_fail:null,
  withSuccessHandler(fn){this._ok=fn;return this;},
  withFailureHandler(fn){this._fail=fn;return this;},
  getDashboard(){
    const run=this;
    window.__previewReads=(window.__previewReads||0)+1;
    setTimeout(()=>{
      if(window.__previewReads>1) window.__previewDashboard.items[0].stock=Math.max(0,window.__previewDashboard.items[0].stock-1);
      const d=structuredClone(window.__previewDashboard);
      d.timestamp=new Date().toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
      run._ok(d);
    },220);
  }
}}};
window.localStorage.setItem('achicell-company-auth',JSON.stringify({token:'preview-token',actor:'preview@example.test',name:'강세윤',admin:false}));
window.__previewDashboard={
  items:[
    {code:'QL-001',name:'40×40 프로파일 실버',size:'40×40',spec:'두께 2.0T',unit:'EA',location:'A-01',stock:127,safety:20,active:true,category:'프로파일',orderCode:'QL-001',kind:'프로파일',color:'실버',hasLength:true,baseLength:2400,lengths:[{mm:2400,stock:127,kind:'원장'}]},
    {code:'QL-002',name:'60×40 프로파일 실버',size:'60×40',spec:'두께 2.0T',unit:'EA',location:'A-02',stock:34,safety:10,active:true,category:'프로파일',orderCode:'QL-002',kind:'프로파일',color:'실버',hasLength:true,baseLength:2400,lengths:[{mm:2400,stock:34,kind:'원장'}]},
    {code:'QL-003',name:'브라켓 연결 부속',size:'',spec:'',unit:'EA',location:'B-03',stock:86,safety:15,active:true,category:'기타 자재',orderCode:'QL-003',kind:'브라켓',color:'',hasLength:false,baseLength:0,lengths:[]},
    {code:'QL-004',name:'40×40 프로파일 블랙',size:'40×40',spec:'두께 1.5T',unit:'EA',location:'A-04',stock:18,safety:20,active:true,category:'프로파일',orderCode:'QL-004',kind:'프로파일',color:'블랙',hasLength:true,baseLength:2400,lengths:[{mm:2400,stock:18,kind:'원장'}]}
  ],
  recent:[],aliases:{},user:{name:'강세윤',email:'preview@example.test',admin:false},appUrl:'https://example.invalid',warnings:[],logCount:0
};`;

const marker = /<script>\r?\n'use strict';/;
if (!marker.test(html)) throw new Error('Could not find the application script insertion point.');
html = html.replace(marker, '<script>\n' + mock + "\n'use strict';");
html = html.replace('<body>', '<body><div style="position:sticky;top:0;z-index:1000;padding:8px 14px;background:#fff3cc;color:#5f4710;text-align:center;font:600 13px/1.4 sans-serif">미리보기 · 예시 데이터 · 저장되지 않음 · 10초마다 다른 사용자 변경을 흉내 냅니다</div>');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log(outputPath);
