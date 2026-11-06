// ARCHICELL Code v3.12 (v3.10 + 작업일 열 · 전체 기간 기록 조회 · 기록의 작업일 수정)
/*
 * v3.12 변경 요약 (v3.10에서 바뀐 부분 · 재고 계산 방식은 그대로)
 * - 입출고내역에 '작업일' 열이 있으면(시트 P열, 제목 '작업일') 저장할 때 작업일을 함께 적습니다.
 *   앱에서 날짜를 바꾸지 않으면 오늘 날짜가 들어갑니다. 열이 없으면 예전처럼 동작합니다.
 * - 작업일은 오늘 또는 과거 400일 안의 날짜만 받습니다(미래 날짜 불가).
 * - getHistory: 최근 100건 제한 없이 기간(시작일~종료일)으로 기록을 찾아 보냅니다(최대 3,000건).
 * - updateLogMemo: 메모와 함께 작업일도 고칠 수 있습니다. 절단 기록은 잘라서 입고된 줄도 같은 작업일로 맞춥니다.
 *   이전 값은 셀 메모(노트)에 남깁니다. 수량·재고는 바뀌지 않습니다.
 * - getDashboard의 기록에 ymd(연도 포함 날짜)와 workDate(작업일)를 추가했습니다. 기존 date 형식은 그대로입니다.
 */
// ARCHICELL Code v3.10 (v3.9 + 품목명 규칙 · 크기 자동 괄호 · 기록 메모 수정) / v3.9 (v3.8 + 사진 저장 권한 오류 수정) — v3.6 큰 사진 · v3.0 길이별 재고
/*
 * v3.9 변경 요약 (v3.8에서 바뀐 부분 · 사진 저장만 바뀜, 재고·입출고 기록 계산은 그대로)
 * - 사진 폴더를 '이름으로 검색'하지 않습니다. 이 검색에 드라이브 읽기 권한이 따로 필요해
 *   "지정된 권한으로는 DriveApp.getFoldersByName을 호출할 수 없습니다" 오류가 났습니다.
 *   이제 한 번 만든 폴더의 ID를 스크립트 속성(ARCHICELL_PHOTO_FOLDER_ID)에 저장해 그 폴더만 씁니다.
 * - 새 함수 setupPhotoFolder: Apps Script 편집기에서 한 번 실행하면 드라이브 권한 승인 창이 뜨고 사진 폴더를 준비합니다.
 * - 권한·저장 오류가 나면 무엇을 해야 하는지 알려주는 문구로 바꿨습니다. 실패해도 품목 정보는 바뀌지 않습니다.
 */
// ARCHICELL Code v3.6 (v3.5 + 큰 사진 저장 · 사진 주소 바꾸기/지우기) — v3.0 길이별 재고 · 크기/주문코드/사진 · 절단 기록
/*
 * v3.6 변경 요약 (v3.5에서 바뀐 부분)
 * - 사진 저장 주소를 w600 → w1600 으로 올려 큰 화면에서도 선명하게 보입니다. (기존 사진 주소는 그대로 두고, 화면에서 크기를 골라 씁니다)
 * - 새 기능 setItemPhoto: 현황 화면에서 사진 주소를 바꾸거나 지울 수 있습니다. (관리자 전용, 시트의 '사진' 칸만 바꿈)
 * - 입출고 기록·재고 수량·다른 열은 건드리지 않습니다.
 */
/*
 * v3.0 변경 요약
 * - 품목 하나(품목코드 1개 = QR 1개) 안에서 길이(mm)별로 재고를 나눠 계산합니다.
 *   · 품목 시트 확장 열: 크기 / 기본길이(mm) / 주문코드 / 사진 (제목으로 찾음)
 *   · 입출고내역 확장 열: 길이(mm) (제목으로 찾음)
 *   · 초기재고(F열)는 '기본길이' 칸의 시작 수량입니다. G열 합계 수식은 그대로입니다.
 * - 새 구분: 절단출고 / 절단입고(한 번에 기록) · 기초재고(전환 때 합친 길이의 시작 수량)
 * - 메뉴 'ARCHICELL 자재관리 > 길이 관리 전환 (v3, 1회)'을 한 번 실행해야 합니다.
 */
/*
 * ARCHICELL v2.7 - 품목코드 변경·기존 QR 호환
 * - Code.gs 및 Index.html 전체 교체, QRLib·appsscript.json은 그대로 둡니다.
 * - 스프레드시트의 '유형 지정 열'에 수치 서식/드롭다운 덮어쓰기 작업을 하지 않습니다.
 * - 품목명/입출고 기록/재고 수치의 자동 삭제 또는 재설정 없음.
 * - 최초 설치 후 데이터 검증은 Apps Script 서버측에서 수행합니다.
 * - 기존 구조가 Google Sheets 표(Table)이고 G열 수식 설정까지 막힌다면,
 *   시트 백업 후 표 메뉴 > '서식 없는 데이터로 되돌리기'(데이터 유지)를 사용하세요.
 */
/** ARCHICELL 자재 재고관리 v2.7 / 품목코드 변경 이력·기존 QR 호환 [변경]
 * 기존 품목 10열 / 입출고내역 10열 호환. 기존 기록 삭제 없음.
 * v2.8 웹 앱: '나'로 실행 / '모든 사용자'. 직원·관리자 공통 비밀번호는 스크립트 속성에 저장.
 */
const CFG = Object.freeze({
  ITEMS: '품목', LOG: '입출고내역', USERS: '사용자', PROPERTY: 'ARCHICELL_SHEET_ID',
  ITEM_HEADERS: ['품목코드','품목명','규격','단위','보관위치','초기재고','현재재고(자동)','안전재고','사용','비고'],
  LOG_HEADERS: ['처리일시','요청ID','품목코드','품목명','구분','수량','재고변동','작업자','메모','처리후재고','취소대상ID','요청서명','작업자계정'],
  USER_HEADERS: ['이메일','표시이름','권한','사용'],
  RENAMES: '품목코드변경이력',
  RENAME_HEADERS: ['변경일시','기존코드','신규코드','작업자계정'],
  ITEM_EXTRA: ['크기','기본길이(mm)','주문코드','사진'],
  LOG_LENGTH: '길이(mm)',
  LOG_WORKDATE: '작업일',
  PHOTO_FOLDER: 'ARCHICELL 자재사진'
});
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
function onOpen() {
  SpreadsheetApp.getUi().createMenu('ARCHICELL 자재관리')
    .addItem('설치 / v2 업그레이드','setupInventory_')
    .addItem('재고 수식 점검','repairStockFormulas_')
    .addItem('품목코드 변경 (기록 유지)','renameCodeFromSheet_')
    .addSeparator()
    .addItem('길이 관리 전환 (v3, 1회)','migrateLengthsV3_').addToUi();
}
function fail_(s) { throw new Error('[확인] ' + s); }
function locked_(fn) {
  const lock=LockService.getScriptLock(); lock.waitLock(25000);
  try { return fn(); } finally { lock.releaseLock(); }
}
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
/** 품목코드 변경 이력은 추가만 합니다. 이전 QR 코드는 계속 새 코드로 연결됩니다. */
function ensureRenameSheet_(ss){
  let sh=ss.getSheetByName(CFG.RENAMES);
  if(!sh){
    sh=ss.insertSheet(CFG.RENAMES);
    sh.getRange(1,1,1,CFG.RENAME_HEADERS.length).setValues([CFG.RENAME_HEADERS]);
    sh.setFrozenRows(1);
  }
  if(sh.getLastColumn()<4 || sh.getRange(1,1,1,4).getDisplayValues()[0].join('|')!==CFG.RENAME_HEADERS.join('|'))
    fail_(CFG.RENAMES+' 시트의 A~D열 제목을 확인하세요. 기존 데이터를 덮어쓰지 않습니다.');
  return sh;
}
function readRenameData_(ss){
  const sh=ss.getSheetByName(CFG.RENAMES);
  if(!sh)return {events:[],direct:Object.create(null),aliases:Object.create(null)};
  if(sh.getLastColumn()<4 || sh.getRange(1,1,1,4).getDisplayValues()[0].join('|')!==CFG.RENAME_HEADERS.join('|'))
    fail_(CFG.RENAMES+'!A1:D1: 열 제목이 코드와 다릅니다.');
  const events=[],direct=Object.create(null);
  rows_(sh,4).forEach((r,i)=>{
    if(!r.some(x=>String(x??'').trim()))return;
    const old=normalizeCode_(r[1]),now=normalizeCode_(r[2]),row=i+2;
    if(!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(old)||!/[A-Z]/.test(old))
      fail_(CFG.RENAMES+'!B'+row+': 이전코드를 확인하세요.');
    if(!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(now)||!/[A-Z]/.test(now)||old===now)
      fail_(CFG.RENAMES+'!C'+row+': 신규코드를 확인하세요.');
    if(Object.prototype.hasOwnProperty.call(direct,old))
      fail_(CFG.RENAMES+'!B'+row+': 이미 변경된 코드 '+old+'가 중복 기록되어 있습니다.');
    direct[old]=now;
    events.push({old:old,now:now,row:row});
  });
  const aliases=Object.create(null);
  Object.keys(direct).forEach(old=>{aliases[old]=resolveCode_(old,direct);});
  return {events:events,direct:direct,aliases:aliases};
}
function resolveCode_(value,direct){
  let code=normalizeCode_(value),count=0;
  const visited=Object.create(null);
  while(Object.prototype.hasOwnProperty.call(direct,code)){
    if(visited[code]||++count>1000)fail_(CFG.RENAMES+' 시트에서 코드 변경 순환이 발견되었습니다: '+code);
    visited[code]=true;code=direct[code];
  }
  return code;
}
/** 품목의 현재코드 및 모든 이전코드를 합산하도록 수식을 작성합니다. */
function stockFormula_(row,code,aliases){
  const canonical=normalizeCode_(code),list=[canonical];
  Object.keys(aliases||{}).forEach(old=>{if(aliases[old]===canonical)list.push(old);});
  // 사용자가 만든 코드는 code_()로 검증되어 인용부호/수식 문법이 들어올 수 없습니다.
  const terms=list.filter(Boolean).map(c=>'SUMIF(\'입출고내역\'!$C$2:$C,"'+c+'",\'입출고내역\'!$G$2:$G)');
  // 마이그레이션 전의 stockFormula_(row) 호출과도 호환됩니다.
  if(!terms.length)terms.push('SUMIF(\'입출고내역\'!$C$2:$C,A'+row+',\'입출고내역\'!$G$2:$G)');
  return '=IF(A'+row+'="","",N(F'+row+')+'+terms.join('+')+')';
}

function setupInventory_() {
  // 에디터에서만 실행할 수 있게 하여 원격에서 저장소/관리자를 바꾸지 못하게 합니다.
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss) fail_('대상 Google 시트의 확장 프로그램 → Apps Script에서 실행하세요.');
  const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
  if(!email) fail_('로그인 계정을 확인할 수 없습니다.');
  try { locked_(function(){
    const old=ss.getSheetByName(CFG.USERS);
    if(old && old.getLastRow()>1) {
      const found=rows_(old,4).find(r=>String(r[0]).toLowerCase().trim()===email);
      if(!found || found[2]!=='관리자' || !active_(found[3])) fail_('기존 관리자만 업그레이드할 수 있습니다.');
    }
    // 변경 전 기존 구조 모두 확인. 미지원 형식은 덮어쓰지 않습니다.
    [[CFG.ITEMS,CFG.ITEM_HEADERS],[CFG.LOG,CFG.LOG_HEADERS],[CFG.USERS,CFG.USER_HEADERS]].forEach(pair=>{
      const sh=ss.getSheetByName(pair[0]); if(!sh||!sh.getLastRow()) return;
      const width=pair[0]===CFG.LOG?10:pair[1].length;
      if(sh.getRange(1,1,1,width).getDisplayValues()[0].join('|')!==pair[1].slice(0,width).join('|')) fail_(pair[0]+' 시트 형식이 다릅니다. 기존 코드를 확인해야 합니다.');
      if(pair[0]===CFG.LOG) logSchema_(sh);
      if(pair[0]===CFG.ITEMS) itemSchema_(sh);
    });
    [[CFG.ITEMS,CFG.ITEM_HEADERS],[CFG.LOG,CFG.LOG_HEADERS],[CFG.USERS,CFG.USER_HEADERS]].forEach(pair=>{
      const sh=ss.getSheetByName(pair[0])||ss.insertSheet(pair[0]);
      const headers=pair[0]===CFG.LOG?logSchema_(sh).headers:pair[0]===CFG.ITEMS?itemSchema_(sh).headers:pair[1];
      if(typeof sh.getMaxColumns==='function'&&sh.getMaxColumns()<headers.length)sh.insertColumnsAfter(sh.getMaxColumns(),headers.length-sh.getMaxColumns());
      // 이미 정확한 제목이 있는 셀을 다시 쓰지 않습니다(유형 지정 열과의 충돌 최소화).
      const current=sh.getLastRow()>0?sh.getRange(1,1,1,headers.length).getDisplayValues()[0]:[];
      headers.forEach((name,i)=>{
        if(!name)return; // 이름이 없는 기존 확장 열은 보존합니다.
        if(current[i]===name)return;
        if(String(current[i]||'').trim())fail_(pair[0]+'!'+columnLetter_(i+1)+'1: 기존 제목을 덮어쓰지 않습니다.');
        sh.getRange(1,i+1).setValue(name);
      });
      sh.setFrozenRows(1);
    });
    ensureRenameSheet_(ss);
    const users=ss.getSheetByName(CFG.USERS);
    if(users.getLastRow()===1) users.appendRow([email,'관리자','관리자',true]);
    PropertiesService.getScriptProperties().setProperty(CFG.PROPERTY,ss.getId());
    const items=ss.getSheetByName(CFG.ITEMS);
    // [v2.6.2] Google Sheets 표(Table)의 유형 지정 열에는
    // setNumberFormat / setDataValidation을 호출할 수 없습니다.
    // 품목코드는 code_()에서 검사하고 분류는 category_()에서 검사합니다.
    // 서식·드롭다운을 다시 쓰지 않아도 앱 기능과 실제 입출고 기록은 보존됩니다.
    const existingRows=rows_(items,10);
    const aliases=readRenameData_(ss).aliases;
    existingRows.forEach((r,i)=>{
      if(r[0]) items.getRange(i+2,7).setFormula(stockFormula_(i+2,r[0],aliases));
    });
    SpreadsheetApp.flush();
  }); } catch(error) {
    const message=String(error && error.message || error);
    if(/유형이 적용된 열|유형이 지정된 열|typed columns?|cells in typed/i.test(message)) {
      fail_('Google Sheets 표(Table)의 유형 지정 열에서 작업이 차단되었습니다. '+
        '원본 데이터를 백업한 뒤, 해당 시트의 표 메뉴 → "서식 없는 데이터로 되돌리기"를 선택하세요. '+
        '"표 삭제"는 데이터를 지울 수 있으므로 누르지 마세요. 원래 오류: '+message);
    }
    throw error;
  }
  SpreadsheetApp.getUi().alert('v2 설정 완료. 기존 품목과 기록을 보존했습니다. 사용자 시트에서 직원 이메일·표시이름·권한(작업자/관리자)·사용(TRUE)을 설정하세요. 새 시트에는 가상 재고를 만들지 않습니다.');
}
function getBook_() {
  const id=PropertiesService.getScriptProperties().getProperty(CFG.PROPERTY);
  if(!id)fail_('먼저 setupInventory를 실행하세요.');
  return SpreadsheetApp.openById(id);
}
function rows_(sh,n) { if(!sh)fail_('v2 설치가 필요합니다.');return sh.getLastRow()<2?[]:sh.getRange(2,1,sh.getLastRow()-1,n).getValues(); }
function active_(v){return v===true||String(v).toUpperCase()==='TRUE';}
function editorAuth_(){
  const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
  if(!email)fail_('계정 확인 불가: 배포 실행 사용자를 ‘웹 앱에 액세스하는 사용자’로 설정하고 Google 로그인·권한 승인을 완료하세요.');
  const user=rows_(getBook_().getSheetByName(CFG.USERS),4).find(r=>String(r[0]).trim().toLowerCase()===email);
  if(!user||!active_(user[3])||!['관리자','작업자'].includes(user[2]))fail_('사용자 시트에 등록된 사용 계정만 접근할 수 있습니다.');
  return {email:email,name:String(user[1]||email),admin:user[2]==='관리자'};
}

// v2.8: Google 이메일 대신 서버에서 검증하는 공통 비밀번호와 서명된 접속권 사용.
// 비밀번호는 프로젝트 설정 > 스크립트 속성에서만 설정합니다. HTML/QR에는 포함하지 않습니다.
function accessConfig_(){
  const p=PropertiesService.getScriptProperties();
  const staff=p.getProperty('ARCHICELL_STAFF_PASSWORD')||'';
  const admin=p.getProperty('ARCHICELL_ADMIN_PASSWORD')||'';
  if(staff.length<4||admin.length<4||staff===admin)
    fail_('관리자 설정 필요: 서로 다른 직원용·관리자용 비밀번호를 스크립트 속성에 각각 4자 이상으로 설정하세요.');
  return {staff:staff,admin:admin};
}
function accessKey_(){
  const p=PropertiesService.getScriptProperties();
  let key=p.getProperty('ARCHICELL_ACCESS_SIGNING_KEY')||p.getProperty('ACHICELL_ACCESS_SIGNING_KEY');
  if(!key){key=Utilities.getUuid()+Utilities.getUuid();p.setProperty('ARCHICELL_ACCESS_SIGNING_KEY',key);}
  return key;
}
function equalAccess_(a,b){
  a=String(a);b=String(b);let diff=a.length^b.length;
  for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
  return diff===0;
}
function accessMac_(value,key){return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(value,key,Utilities.Charset.UTF_8));}
function decodeAccess_(token,allowExpired){
  if(typeof token!=='string'||token.length>2500)throw Error('invalid');
  const bits=token.split('.');if(bits.length!==2)throw Error('invalid');
  const keys=PropertiesService.getScriptProperties();
  const key=keys.getProperty('ARCHICELL_ACCESS_SIGNING_KEY')||keys.getProperty('ACHICELL_ACCESS_SIGNING_KEY');
  if(!key||!equalAccess_(bits[1],accessMac_(bits[0],key)))throw Error('invalid');
  const u=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(bits[0])).getDataAsString());
  if(!u||!['staff','admin'].includes(u.role)||typeof u.name!=='string'||!u.name||u.name.length>30||!/^shared:[a-f0-9-]{36}$/.test(u.actor))throw Error('invalid');
  const cfg=accessConfig_();
  if(!equalAccess_(u.rev,accessMac_(u.role==='admin'?cfg.admin:cfg.staff,key)))throw Error('changed');
  return u;
}
function auth_(token){
  let u;try{u=decodeAccess_(token,false);}catch(e){fail_('접속 만료: 회사 비밀번호와 이름으로 다시 접속하세요.');}
  return {name:u.name,email:u.actor,admin:u.role==='admin'};
}
function loginCompany(p){return locked_(function(){
  p=p||{};const cfg=accessConfig_(),cache=CacheService.getScriptCache();
  // 비밀번호 대입 시도 제한. 실패 누적은 전체 앱에 적용되며 잠시 후 해제됩니다.
  const windowKey='access-fails-'+Math.floor(Date.now()/300000);
  const fails=Number(cache.get(windowKey)||0);
  if(fails>=30)fail_('접속 시도가 많습니다. 최대 5분 후 다시 시도하세요.');
  const role=p.role==='admin'?'admin':'staff',password=String(p.password||'');
  if(password.length>256||!equalAccess_(password,role==='admin'?cfg.admin:cfg.staff)){
    cache.put(windowKey,String(fails+1),300);fail_('비밀번호가 맞지 않습니다. 직원용·관리자용 선택을 확인하세요.');
  }
  const name=String(p.name||'').trim();
  if(!name||name.length>30||/[\u0000-\u001f\u007f]/.test(name))fail_('작업자 이름을 1~30자로 입력하세요.');
  let actor='shared:'+Utilities.getUuid();
  // 세션 만료 후 같은 사람이 재접속해도 미응답 요청을 같은 ID로 확인할 수 있습니다.
  try{const old=decodeAccess_(p.previousToken,true);if(old.name===name&&old.role===role)actor=old.actor;}catch(e){}
  const key=accessKey_(),u={name:name,role:role,actor:actor,persistent:true,rev:accessMac_(password,key)};
  const body=Utilities.base64EncodeWebSafe(JSON.stringify(u),Utilities.Charset.UTF_8);
  return {token:body+'.'+accessMac_(body,key),name:name,actor:actor,admin:role==='admin',persistent:true};
});}

function admin_(u){if(!u.admin)fail_('관리자만 실행할 수 있습니다.');}
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
function doGet(e){
  const q=(e&&e.parameter)||{},qs=String(q.sku||'').slice(0,40),qa=['in','out'].includes(String(q.action||''))?String(q.action):'';
  if(q.format==='app')return ContentService.createTextOutput(renderIndex_(qs,qa)).setMimeType(ContentService.MimeType.TEXT);
  const pub=publicUrl_();
  if(pub&&q.legacy!=='1')return redirectPage_(pub,qs,qa);
  const t=HtmlService.createTemplateFromFile('Index');
  t.initialSku=String(e&&e.parameter&&e.parameter.sku||'').slice(0,40);
  const action=String(e&&e.parameter&&e.parameter.action||'');
  t.initialAction=['in','out'].includes(action)?action:'';
  return t.evaluate().setTitle('ARCHICELL 자재관리').addMetaTag('viewport','width=device-width, initial-scale=1');
}
function include_(name){return HtmlService.createHtmlOutputFromFile(name).getContent();}
/* stockFormula_는 위에서 코드 변경 이력을 반영해 정의했습니다. */
function repairStockFormulas_(){locked_(function(){admin_(editorAuth_());const ss=getBook_(),sh=ss.getSheetByName(CFG.ITEMS),aliases=readRenameData_(ss).aliases;rows_(sh,10).forEach((r,i)=>{if(r[0])sh.getRange(i+2,7).setFormula(stockFormula_(i+2,r[0],aliases));});SpreadsheetApp.flush();});}
/** A~J 고정, 확장 열은 제목으로 찾습니다. 기존 이메일·계정ID 열을 이동하거나 덮어쓰지 않습니다. */
function logSchema_(sh){
  const base=CFG.LOG_HEADERS.slice(0,10);
  const headers=sh.getLastRow()?sh.getRange(1,1,1,Math.max(10,sh.getLastColumn())).getDisplayValues()[0]:base.slice();
  if(headers.slice(0,10).join('|')!==base.join('|'))fail_('입출고내역 A~J열 제목이 기존 형식과 다릅니다.');
  function find(name){const matches=[];headers.forEach((h,i)=>{if(h===name)matches.push(i);});if(matches.length>1)fail_('입출고내역에 중복된 열 제목이 있습니다: '+name);return matches.length?matches[0]:-1;}
  function need(name){const i=find(name);if(i>=0)return i;headers.push(name);return headers.length-1;}
  const target=need('취소대상ID'),signature=need('요청서명');
  const email=find('작업자이메일');
  let actor=find('작업자계정');if(actor<0)actor=email>=0?email:need('작업자계정');
  // v3.0: 길이(mm) 열은 '길이 관리 전환' 메뉴가 만듭니다. 없으면 -1(길이 없이 동작).
  const length=find(CFG.LOG_LENGTH);
  // v3.12 작업일 열(선택). 없으면 -1.
  const workDate=find(CFG.LOG_WORKDATE);
  return {headers:headers,target:target,signature:signature,actor:actor,email:email,length:length,workDate:workDate};
}
/** v2.6.1: 숨겨진 열을 포함해 읽되, 실제 스프레드시트 행 번호를 함께 보존. */
function readLogs_(sh){
  const schema=logSchema_(sh);
  if(schema.headers.length>sh.getLastColumn())
    fail_('입출고내역 1행: 필요한 확장 열이 없습니다. 먼저 setupInventory를 실행하세요.');

  const logs=[];
  rows_(sh,schema.headers.length).forEach((source,index)=>{
    // 시트의 1행은 제목 행입니다. 빈 행을 걸러도 행 번호가 바뀌지 않도록 합니다.
    if(!source.some(value=>String(value??'').trim()!==''))return;
    const log=source.slice(0,10).concat([
      source[schema.target]||'',
      source[schema.signature]||'',
      String(source[schema.actor]||(schema.email>=0?source[schema.email]:'')||'').trim().toLowerCase(),
      schema.length>=0?lenCell_(source[schema.length]):0,   // [13] 길이(mm), 0 = 길이 미기록
      schema.workDate>=0?ymdCell_(source[schema.workDate]):''   // [14] v3.12 작업일(yyyy-MM-dd), '' = 미기록
    ]);
    // 배열 형식을 유지하므로 기존 취소/입출고/재고 처리 로직은 그대로 동작합니다.
    log.sheetRow=index+2;
    logs.push(log);
  });
  return {schema:schema,logs:logs};
}
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
/** 시트 열 번호를 A, B, ... AA 형식으로 표시 (분류 확장 열 안내용). */
function columnLetter_(number){
  let result='';
  for(let n=number;n>0;n=Math.floor((n-1)/26))result=String.fromCharCode(65+(n-1)%26)+result;
  return result;
}
/** v2.6.1: 읽기/검증만 수행. 기존 품목/입출고 데이터를 수정하지 않습니다. */
function state_(){
  const ss=getBook_(),logData=readLogs_(ss.getSheetByName(CFG.LOG));
  const logs=logData.logs,itemsSh=ss.getSheetByName(CFG.ITEMS);
  const itemSchema=itemSchema_(itemsSh),raw=rows_(itemsSh,itemSchema.headers.length);
  const renameData=readRenameData_(ss),aliases=renameData.aliases,direct=renameData.direct;
  const totals=Object.create(null),versions=Object.create(null),codes=Object.create(null),lenTotals=Object.create(null);
  const ex=itemSchema.extra;

  logs.forEach(r=>{
    const row=r.sheetRow;
    const code=normalizeCode_(r[2]);
    if(!code)fail_('입출고내역!C'+row+' (품목코드): 값이 비어 있습니다. '+
      '같은 '+row+'행의 숨겨진 B열/K열 이후 기록이 남아 있는지 확인하세요. 기록을 임의로 삭제하지 마세요.');

    const rawDelta=r[6];
    if(rawDelta===null||rawDelta===undefined||String(rawDelta).trim()==='')
      fail_('입출고내역!G'+row+' (재고변동): 값이 비어 있습니다. '+
        '기존 입출고 기록이 일부 삭제되었는지 확인하세요.');
    const delta=Number(rawDelta);
    if(!Number.isSafeInteger(delta))
      fail_('입출고내역!G'+row+' (재고변동): 정수가 아닙니다. '+
        '현재 값: '+String(rawDelta).slice(0,40)+' / 예: 입고 3, 출고 -3');

    const canonical=resolveCode_(code,direct);
    totals[canonical]=(totals[canonical]||0)+delta;
    versions[canonical]=String(r[1]);
    // v3.0 길이별 합계. 0 = 길이 미기록(아래에서 기본길이로 합칩니다).
    const lk=r[13]||0,bucket=lenTotals[canonical]||(lenTotals[canonical]={sum:Object.create(null),stocked:Object.create(null),tagged:false});
    bucket.sum[lk]=(bucket.sum[lk]||0)+delta;
    if(lk)bucket.tagged=true;
    if(['입고','기초재고','실사조정'].includes(String(r[4])))bucket.stocked[lk]=true;
  });

  const items=raw.map((r,index)=>({r:r,row:index+2}))
    .filter(entry=>entry.r[0])
    .map(entry=>{
      const r=entry.r,row=entry.row,code=normalizeCode_(r[0]);
      if(Object.prototype.hasOwnProperty.call(codes,code))
        fail_('품목!A'+row+' (품목코드): 중복 코드 '+code+'. '+
          '품목!A'+codes[code]+'에도 같은 코드가 있습니다.');
      codes[code]=row;
      if(Object.prototype.hasOwnProperty.call(direct,code))
        fail_('품목!A'+row+': 변경 이력에는 이전 코드로 기록되어 있습니다. 코드 변경이 중간에 실패했는지 확인하세요: '+code);

      const start=Number(r[5]),stock=start+(totals[code]||0),safety=Number(r[7]||0);
      if(!Number.isSafeInteger(start))
        fail_('품목!F'+row+' (초기재고): 정수를 입력해야 합니다. 현재 값: '+String(r[5]).slice(0,40));
      if(!Number.isSafeInteger(safety))
        fail_('품목!H'+row+' (안전재고): 정수를 입력해야 합니다. 현재 값: '+String(r[7]).slice(0,40));
      if(!Number.isSafeInteger(stock))
        fail_('품목!F'+row+' (초기재고/재고합계): 계산 결과가 유효한 정수가 아닙니다. 관련 입출고 기록을 확인하세요.');

      let category;
      try{category=category_(r[itemSchema.category]);}
      catch(error){
        fail_('품목!'+columnLetter_(itemSchema.category+1)+row+' (분류): '+
          '원장 / 기타 자재 / 확인 필요 중에서 선택하세요.');
      }
      // v3.0 길이별 재고: 초기재고는 기본길이 칸, 길이 미기록 기록도 기본길이 칸으로 합칩니다.
      const baseLength=ex.base>=0?lenCell_(r[ex.base]):0;
      const bucket=lenTotals[code]||{sum:Object.create(null),stocked:Object.create(null),tagged:false};
      const map=Object.create(null),stockedMap=Object.create(null);
      map[baseLength]=start;stockedMap[baseLength]=true;
      Object.keys(bucket.sum).forEach(k=>{
        const mm=Number(k)||baseLength;
        map[mm]=(map[mm]||0)+bucket.sum[k];
        if(bucket.stocked[k])stockedMap[mm]=true;
      });
      const lengths=Object.keys(map).map(Number).sort((a,b)=>b-a)
        .map(mm=>({mm:mm,stock:map[mm],stocked:!!stockedMap[mm]}));
      return {
        code:code,name:String(r[1]),spec:String(r[2]||''),unit:String(r[3]||'EA'),
        location:String(r[4]||''),start:start,stock:stock,safety:safety,
        active:r[8]!==false&&String(r[8]).toUpperCase()!=='FALSE',memo:String(r[9]||''),
        category:category,categoryExplicit:String(r[itemSchema.category]??'').trim()!=='',
        size:ex.size>=0?String(r[ex.size]??'').trim():'',
        orderCode:ex.order>=0?String(r[ex.order]??'').trim():'',
        photo:ex.photo>=0?String(r[ex.photo]??'').trim():'',
        kind:ex.kind>=0?String(r[ex.kind]??'').trim():'',color:ex.color>=0?String(r[ex.color]??'').trim():'',
        baseLength:baseLength,lengths:lengths,hasLength:baseLength>0||bucket.tagged,lengthTagged:bucket.tagged,
        editVersion:itemVersion_(r,itemSchema),version:JSON.stringify([r[5],versions[code]||''])
      };
    });
  return {ss:ss,logs:logs,items:items,logSchema:logData.schema,aliases:aliases,directAliases:direct};
}
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
function getDashboard(accessToken){return locked_(function(){
  const user=auth_(accessToken),s=state_(),canceled=canceledSet_(s);
  const recent=s.logs.slice(-100).reverse().map(r=>logView_(r,s,user,canceled));
  return {items:s.items,recent:recent,aliases:Object.assign({},s.aliases),user:user,appUrl:publicUrl_()||ScriptApp.getService().getUrl()||'',warnings:user.admin?dashboardWarnings_(s):[],timestamp:Utilities.formatDate(new Date(),'Asia/Seoul','yyyy-MM-dd HH:mm:ss')};
});}
function canceledSet_(s){return new Set(s.logs.filter(r=>r[4]==='취소').map(r=>String(r[10])));}
/** 화면에 보내는 기록 한 줄. v3.12: ymd(연도 포함 처리일)·workDate(작업일) 추가, 기존 date 형식(MM-dd HH:mm:ss)은 유지. */
function logView_(r,s,user,canceled){
  const d=r[0] instanceof Date?r[0]:null,code=resolveCode_(r[2],s.directAliases);
  return {id:String(r[1]),date:d?Utilities.formatDate(d,'Asia/Seoul','MM-dd HH:mm:ss'):String(r[0]),ymd:d?Utilities.formatDate(d,'Asia/Seoul','yyyy-MM-dd'):'',
    workDate:r[14]||'',code:String(r[2]),name:String(r[3]),type:String(r[4]),quantity:Number(r[5]),delta:Number(r[6]),operator:String(r[7]),memo:String(r[8]||''),stock:Number(r[9]),
    unit:s.items.find(i=>i.code===code)?.unit||'EA',currentCode:code,canceled:canceled.has(String(r[1])),length:Number(r[13])||0,
    canCancel:['입고','출고','절단출고'].includes(r[4])&&!canceled.has(String(r[1]))&&(user.admin||r[12]===user.email),canMemo:!!(user.admin||r[12]===user.email)};
}
/** v3.12 기간 기록 조회: 최근 100건 제한 없이 처리일(또는 작업일) 기준으로 찾습니다. 화면이 느려지지 않도록 최대 3,000건. */
function getHistory(p, accessToken){return locked_(function(){
  const user=auth_(accessToken),s=state_(),canceled=canceledSet_(s);
  const from=ymdArg_(p&&p.from),to=ymdArg_(p&&p.to),by=p&&p.by==='work'?'work':'done',LIMIT=3000;
  const out=[];let matched=0;
  for(let k=s.logs.length-1;k>=0;k--){
    const r=s.logs[k],d=r[0] instanceof Date?Utilities.formatDate(r[0],'Asia/Seoul','yyyy-MM-dd'):'';
    const key=by==='work'?(r[14]||d):d;
    if(from&&(!key||key<from))continue;
    if(to&&(!key||key>to))continue;
    matched++;if(out.length<LIMIT)out.push(logView_(r,s,user,canceled));
  }
  return {rows:out,matched:matched,limited:matched>out.length,from:from,to:to,by:by,total:s.logs.length};
});}
function ymdArg_(v){const t=String(v||'').trim();if(!t)return '';if(!/^\d{4}-\d{2}-\d{2}$/.test(t))fail_('날짜는 2026-11-06 형식으로 입력하세요.');return t;}
/** 시트 칸의 작업일 → yyyy-MM-dd. 날짜가 아니면 ''. */
function ymdCell_(v){
  if(v instanceof Date&&!isNaN(v))return Utilities.formatDate(v,'Asia/Seoul','yyyy-MM-dd');
  const m=/^(\d{4})[-./\s]+(\d{1,2})[-./\s]+(\d{1,2})/.exec(String(v??'').trim());
  return m?m[1]+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[3]).slice(-2):'';
}
function todayYmd_(){return Utilities.formatDate(new Date(),'Asia/Seoul','yyyy-MM-dd');}
/** 사용자가 보낸 작업일. 비우면 ''(=오늘로 기록). 미래 날짜·400일보다 오래된 날짜는 거부. */
function workDate_(v){
  const t=ymdArg_(v);if(!t)return '';
  const today=todayYmd_(),d=new Date(t+'T00:00:00+09:00');
  if(isNaN(d)||Utilities.formatDate(d,'Asia/Seoul','yyyy-MM-dd')!==t)fail_('작업일이 올바른 날짜가 아닙니다: '+t);
  if(t>today)fail_('작업일은 오늘('+today+') 이후로 정할 수 없습니다.');
  if((new Date(today+'T00:00:00+09:00')-d)/86400000>400)fail_('작업일은 최근 400일 안에서만 정할 수 있습니다.');
  return t;
}
// [v2.6 변경 D] 공백/대소문자 통일, 영문 1자 이상 필수.
function normalizeCode_(v){return String(v??'').replace(/\s+/g,'').toUpperCase();}
function code_(v){const c=normalizeCode_(v);if(!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(c)||!/[A-Z]/.test(c))fail_('품목코드는 영문을 1자 이상 포함한 2~40자(영문·숫자·-·_)로 입력하세요. 예: 3060-BK-2250');return c;}
function displayUnit_(v){const unit=String(v||'EA').trim();return unit.toUpperCase()==='EA'||unit==='본'?'EA':unit;}
function int_(v,min){if(v===''||v===null||v===undefined)fail_('수량을 입력하세요.');const n=Number(v);if(!Number.isSafeInteger(n)||n<min||n>1000000)fail_('수량은 '+min+'~1,000,000 사이의 정수입니다.');return n;}
// v3.10 크기 표기: 30x30 · 30*30 · 30 × 30 → (30x30). 숫자x숫자 모양이 아니면 예전처럼 x만 통일합니다.
function sizeFmt_(v){
  const raw=String(v==null?'':v).trim(),t=raw.replace(/[()（）\s]/g,'').replace(/[*×xX]/g,'x');
  return /^\d+(\.\d+)?x\d+(\.\d+)?$/.test(t)?'('+t+')':raw.replace(/\s*[*×xX]\s*/g,'x');
}
// v3.10 품목명: 종류 + (크기) + 색상. 종류에 이미 크기 숫자가 있으면(예: "3030 프로파일") 크기는 붙이지 않고,
// 기본색 실버는 이름에 붙이지 않습니다(블랙 등 다른 색만 붙임).
function itemName_(kind,size,color){
  const k=String(kind||'').trim(),sz=sizeFmt_(size),core=sz.replace(/[()]/g,'').toLowerCase();
  const kn=k.replace(/[()（）\s]/g,'').replace(/[*×X]/g,'x').toLowerCase();
  const has=!!core&&(kn.indexOf(core)>=0||kn.indexOf(core.replace('x',''))>=0);
  const c=String(color||'').trim();
  return [k,(core&&!has)?sz:'',(c&&c!=='실버')?c:''].filter(Boolean).join(' ');
}
// v3.10 기록 메모 수정: 메모 칸만 바꿉니다(수량·재고·기록은 그대로). 이전 메모는 셀 메모(노트)에 남깁니다.
// v3.12: p.workDate가 오면 작업일도 고칩니다. 절단출고를 고치면 함께 생긴 절단입고 줄도 같은 작업일로 맞춥니다.
function updateLogMemo(p, accessToken){return locked_(function(){
  const u=auth_(accessToken),s=state_(),target=txt_(p.target,100);
  const row=s.logs.find(r=>String(r[1])===target);
  if(!row)fail_('기록을 찾을 수 없습니다.');
  if(!u.admin&&row[12]!==u.email)fail_('본인의 기록만 수정할 수 있습니다.');
  const sh=getBook_().getSheetByName(CFG.LOG);
  const head=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
  const stamp=Utilities.formatDate(new Date(),'Asia/Seoul','yyyy-MM-dd HH:mm');
  const code=resolveCode_(row[2],s.directAliases);let changed=false;
  if(p.memo!==undefined&&p.memo!==null){
    const memo=txt_(p.memo,250);
    let col=head.indexOf('메모')+1;if(col<1)col=9;
    const range=sh.getRange(row.sheetRow,col),old=String(range.getValue()||'');
    if(old!==memo){
      range.setValue(memo?cell_(memo):'');
      const prev=String(range.getNote()||'');
      range.setNote((prev?prev+'\n':'')+stamp+' '+u.name+' 메모 수정 · 이전: '+(old||'(없음)'));
      changed=true;
    }
  }
  if(p.workDate!==undefined&&p.workDate!==null&&String(p.workDate).trim()!==''){
    const wd=workDate_(p.workDate),col=s.logSchema.workDate+1;
    if(col<1)fail_('입출고내역에 \'작업일\' 열이 없습니다. 관리자에게 시트 P1칸에 \'작업일\' 제목을 넣어 달라고 요청하세요.');
    const rows=[row].concat(row[4]==='절단출고'?s.logs.filter(r=>r[4]==='절단입고'&&String(r[10])===target):[]);
    rows.forEach(r=>{
      const range=sh.getRange(r.sheetRow,col),old=r[14]||'';
      if(old===wd)return;
      range.setValue(wd);
      const prev=String(range.getNote()||'');
      range.setNote((prev?prev+'\n':'')+stamp+' '+u.name+' 작업일 수정 · 이전: '+(old||'(없음)'));
      changed=true;
    });
  }
  return changed?{code:code}:{code:code,unchanged:true};
});}
function txt_(v,max){return String(v||'').trim().slice(0,max);}
function cell_(v){const s=String(v);return /^[\s]*[=+@-]/.test(s)?"'"+s:s;}
function request_(p){const id=txt_(p.requestId,100);if(!/^[a-zA-Z0-9_-]{8,100}$/.test(id))fail_('요청 ID가 올바르지 않습니다.');return id;}
function signature_(data){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(data)));}
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
function previous_(s,id,sig){
  const row=s.logs.find(r=>String(r[1])===id);if(!row)return null;
  if(row[11]!==sig)fail_('같은 요청 ID의 내용이 다릅니다. 기록을 확인하세요.');
  const resolved=resolveCode_(row[2],s.directAliases);
  const item=s.items.find(i=>i.code===resolved);
  const length=Number(row[13])||(item?item.baseLength:0)||0;
  const ls=item&&item.lengths.find(l=>l.mm===length);
  return {ok:true,duplicate:true,code:resolved,type:String(row[4]),quantity:Number(row[5]),stock:Number(row[9]),currentStock:item?item.stock:null,
    length:length,lengthStock:ls?ls.stock:null,lengths:item?item.lengths:null};
}

/* ---------- v3.0 길이 ---------- */
/** 사용자가 보낸 길이(mm). 비어 있으면 0(길이 없음), required면 필수. */
function len_(v,required){
  const s=String(v??'').replace(/mm$/i,'').trim();
  if(!s){if(required)fail_('길이(mm)를 입력하세요.');return 0;}
  const n=Number(s);
  if(!Number.isSafeInteger(n)||n<1||n>100000)fail_('길이는 1~100,000mm 사이의 정수로 입력하세요.');
  return n;
}
/** 시트 칸에서 읽는 길이: 숫자가 아니면 0. */
function lenCell_(v){const n=parseInt(String(v??'').replace(/[^0-9]/g,''),10);return Number.isSafeInteger(n)&&n>0&&n<=100000?n:0;}
function lenLabel_(mm){return mm?mm+'mm ':'';}
/** 품목의 길이 칸을 정합니다. 길이 관리 품목은 길이가 필수, 아닌 품목은 길이를 받지 않습니다. */
function itemLength_(item,raw){
  const mm=typeof raw==='number'?raw:len_(raw,false);
  if(item.hasLength){
    if(!mm)fail_('길이(mm)를 선택하세요. '+item.code+'은 길이별로 관리하는 품목입니다.');
    return mm;
  }
  if(mm)fail_(item.code+'은 길이별로 관리하지 않는 품목입니다. 길이를 비우고 저장하세요. (관리 화면에서 기본 길이를 정하면 길이 관리가 시작됩니다)');
  return 0;
}
function lengthStock_(item,mm){const l=item.lengths.find(x=>x.mm===mm);return l?l.stock:0;}

/** 여러 기록을 한 번에 검사하고 한 번에 씁니다. 길이별·전체 재고가 음수가 되면 아무것도 쓰지 않습니다. */
function writeLogs_(s,u,item,entries,sig){
  const schema=s.logSchema,unit=displayUnit_(item.unit);
  if(item.hasLength&&schema.length<0)
    fail_('입출고내역에 '+CFG.LOG_LENGTH+' 열이 없습니다. 시트 메뉴 ARCHICELL 자재관리 > 길이 관리 전환 (v3, 1회)을 먼저 실행하세요.');
  const lens=Object.create(null),stocked=Object.create(null);
  item.lengths.forEach(l=>{lens[l.mm]=l.stock;stocked[l.mm]=l.stocked;});
  let total=item.stock;const rows=[],now=new Date();
  entries.forEach(en=>{
    const k=en.length||0,cur=lens[k]||0,next=cur+en.delta;
    if(en.delta<0&&next<0)fail_(lenLabel_(k)+'현재 재고 '+cur+unit+'로는 처리할 수 없습니다.');
    lens[k]=next;total+=en.delta;
    if(['입고','기초재고','실사조정'].includes(en.type))stocked[k]=true;
    if(!Number.isSafeInteger(total)||total<0)fail_('현재 재고 '+item.stock+unit+'로는 처리할 수 없습니다.');
    const row=Array(schema.headers.length).fill('');
    [now,en.id,item.code,cell_(item.name),en.type,en.qty,en.delta,cell_(u.name),cell_(en.memo||''),total].forEach((v,i)=>row[i]=v);
    row[schema.target]=en.target||'';row[schema.signature]=sig;row[schema.actor]=u.email;
    if(schema.email>=0)row[schema.email]=u.email;
    if(schema.length>=0)row[schema.length]=k||'';
    if(schema.workDate>=0)row[schema.workDate]=en.workDate||todayYmd_();
    rows.push(row);
  });
  const sh=s.ss.getSheetByName(CFG.LOG);
  sh.getRange(sh.getLastRow()+1,1,rows.length,rows[0].length).setValues(rows);
  SpreadsheetApp.flush();
  const first=entries[0],fk=first.length||0;
  const lengths=Object.keys(lens).map(Number).sort((a,b)=>b-a).map(mm=>({mm:mm,stock:lens[mm],stocked:!!stocked[mm]}));
  return {ok:true,duplicate:false,code:item.code,type:first.type,quantity:first.qty,stock:total,currentStock:total,
    length:fk,lengthStock:lens[fk],lengths:lengths};
}
function append_(s,u,id,item,type,quantity,delta,memo,target,sig,length,workDate){
  return writeLogs_(s,u,item,[{id:id,type:type,qty:quantity,delta:delta,memo:memo,target:target,length:length||0,workDate:workDate||''}],sig);
}
function saveTransaction(p, accessToken){return locked_(function(){
  const u=auth_(accessToken),s=state_(),code=code_(p.code),type=String(p.type),qty=int_(p.quantity,1),id=request_(p),memo=txt_(p.memo,250);
  if(!['입고','출고'].includes(type))fail_('입고·출고를 선택하세요.');
  const rawLen=len_(p.length,false),wd=workDate_(p.workDate);
  const base=rawLen?[u.email,code,type,qty,memo,rawLen]:[u.email,code,type,qty,memo];
  const sig=signature_(wd?base.concat([wd]):base),prev=previous_(s,id,sig);if(prev)return prev;
  const item=s.items.find(i=>i.code===resolveCode_(code,s.directAliases));if(!item||!item.active)fail_('사용 가능한 품목이 아닙니다.');
  if(item.stock<0)fail_('음수 재고입니다. 관리자 실사 조정이 필요합니다.');
  const length=itemLength_(item,rawLen);
  if(type==='출고'&&length&&!item.lengths.some(l=>l.mm===length&&l.stock>0))fail_(length+'mm 재고가 없습니다. 길이를 다시 확인하세요.');
  return append_(s,u,id,item,type,qty,type==='입고'?qty:-qty,memo,'',sig,length,wd);
});}
function adjustStock(p, accessToken){return locked_(function(){
  const u=auth_(accessToken);admin_(u);const s=state_(),code=code_(p.code),count=int_(p.count,0),reason=txt_(p.reason,250),id=request_(p),version=String(p.version||'');
  if(!reason)fail_('실사 조정 사유를 입력하세요.');
  const rawLen=len_(p.length,false);
  const sig=signature_(rawLen?[u.email,code,'실사조정',count,reason,version,rawLen]:[u.email,code,'실사조정',count,reason,version]),prev=previous_(s,id,sig);if(prev)return prev;
  const item=s.items.find(i=>i.code===resolveCode_(code,s.directAliases));if(!item||!item.active)fail_('사용 가능한 품목이 아닙니다.');
  if(item.version!==version)fail_('실사 화면 이후 재고가 변경되었습니다. 새로고침 후 다시 개수를 확인하세요.');
  const length=itemLength_(item,rawLen);
  return append_(s,u,id,item,'실사조정',count,count-lengthStock_(item,length),reason,'',sig,length);
});}
/** v3.0 절단: 원래 길이 출고 + 잘린 길이 입고를 한 번에 기록합니다. */
function cutStock(p, accessToken){return locked_(function(){
  const u=auth_(accessToken),s=state_(),code=code_(p.code),id=request_(p),memo=txt_(p.memo,250);
  const from=len_(p.fromLength,true),count=int_(p.count,1);
  if(!Array.isArray(p.pieces)||!p.pieces.length||p.pieces.length>8)fail_('잘라서 나온 길이를 1~8줄 입력하세요.');
  const merged=Object.create(null);
  p.pieces.forEach(pc=>{
    const mm=len_(pc&&pc.length,true),q=int_(pc&&pc.qty,1);
    if(mm>=from)fail_('잘린 길이('+mm+'mm)는 원래 길이('+from+'mm)보다 짧아야 합니다.');
    merged[mm]=(merged[mm]||0)+q;
  });
  const pieces=Object.keys(merged).map(Number).sort((a,b)=>b-a).map(mm=>({length:mm,qty:merged[mm]}));
  const used=pieces.reduce((a,pc)=>a+pc.length*pc.qty,0);
  if(used>from*count)fail_('잘린 길이의 합('+used+'mm)이 원래 자재('+from+'mm × '+count+' = '+(from*count)+'mm)보다 깁니다. 길이와 개수를 확인하세요.');
  const wd=workDate_(p.workDate),cbase=[u.email,code,'절단',from,count,JSON.stringify(pieces),memo];
  const sig=signature_(wd?cbase.concat([wd]):cbase),prev=previous_(s,id,sig);if(prev)return prev;
  const item=s.items.find(i=>i.code===resolveCode_(code,s.directAliases));if(!item||!item.active)fail_('사용 가능한 품목이 아닙니다.');
  if(!item.hasLength)fail_('길이별로 관리하는 품목만 절단을 기록할 수 있습니다. 관리 화면에서 기본 길이를 먼저 정하세요.');
  const fromStock=lengthStock_(item,from);
  if(fromStock<count)fail_(from+'mm 재고가 '+fromStock+displayUnit_(item.unit)+'라 '+count+displayUnit_(item.unit)+'를 자를 수 없습니다.');
  const entries=[{id:id,type:'절단출고',qty:count,delta:-count,memo:memo,target:'',length:from,workDate:wd}]
    .concat(pieces.map((pc,k)=>({id:id+'_c'+(k+1),type:'절단입고',qty:pc.qty,delta:pc.qty,memo:memo,target:id,length:pc.length,workDate:wd})));
  const r=writeLogs_(s,u,item,entries,sig);
  r.pieces=pieces;return r;
});}
// [v2.6 변경] 분류/단위 또는 코드 정규화 호환. 자세한 차이는 변경내용.diff 참조.
// v3.0: 길이 기록 반영, 절단은 묶음(원래 길이 출고 + 잘린 길이 입고)을 한꺼번에 취소합니다.
function cancelTransaction(p, accessToken){return locked_(function(){
  const u=auth_(accessToken),s=state_(),id=request_(p),target=txt_(p.target,100),reason=txt_(p.reason,250);
  if(!reason)fail_('취소 사유를 입력하세요.');
  const sig=signature_([u.email,'취소',target,reason]),prev=previous_(s,id,sig);if(prev)return prev;
  const original=s.logs.find(r=>String(r[1])===target);
  if(!original||!['입고','출고','절단출고'].includes(original[4]))fail_('입고·출고·절단 기록만 취소할 수 있습니다. 실사 조정은 새 실사로 바로잡으세요.');
  if(!u.admin&&original[12]!==u.email)fail_('본인의 기록만 취소할 수 있습니다.');
  if(s.logs.some(r=>r[4]==='취소'&&r[10]===target))fail_('이미 취소한 기록입니다.');
  const item=s.items.find(i=>i.code===resolveCode_(original[2],s.directAliases));if(!item)fail_('품목을 찾을 수 없습니다.');
  const lastAudit=s.logs.map((r,i)=>resolveCode_(r[2],s.directAliases)===item.code&&r[4]==='실사조정'?i:-1).reduce((a,b)=>Math.max(a,b),-1);
  if(s.logs.indexOf(original)<lastAudit)fail_('실사 이전 기록입니다. 관리자에게 새 실사 조정을 요청하세요.');
  const group=original[4]==='절단출고'
    ?s.logs.filter(r=>String(r[1])===target||(r[4]==='절단입고'&&String(r[10])===target))
    :[original];
  // 잘린 조각을 먼저 빼고, 원래 길이를 마지막에 되돌립니다.
  const ordered=group.slice().reverse();
  const entries=ordered.map((g,k)=>({id:k===0?id:id+'_c'+k,type:'취소',qty:Number(g[5]),delta:-Number(g[6]),memo:reason,target:String(g[1]),
    length:Number(g[13])||item.baseLength||0,workDate:g[14]||''}));  // v3.12 취소는 원래 기록의 작업일로 맞춤(작업일 기준 집계가 상쇄되도록)
  const r=writeLogs_(s,u,item,entries,sig);
  r.quantity=Number(original[5]);r.length=Number(original[13])||item.baseLength||0;r.lengthStock=null;
  return r;
});}
// [v2.6 변경 A/B/C] A~J 유지, 분류는 제목으로 찾은 확장 열에만 기록.
function saveItem(p, accessToken){return locked_(function(){
  admin_(auth_(accessToken));
  {const sh0=getBook_().getSheetByName(CFG.ITEMS),ex0=itemSchema_(sh0).extra;if(ex0.kind<0)addHeader_(sh0,'종류');if(ex0.color<0)addHeader_(sh0,'색상');SpreadsheetApp.flush();}
  // v3.5 종류·크기·색상으로 품목명을 자동으로 만듭니다(예: 프로파일 20x40 실버)
  const tidy=v=>String(v??'').replace(/\s+/g,' ').trim();
  const kind=p.kind===undefined?undefined:txt_(tidy(p.kind),30),color=p.color===undefined?undefined:txt_(tidy(p.color),8);
  if(kind!==undefined){if(!kind)fail_('종류를 입력하세요. 예: 프로파일');p=Object.assign({},p,{name:itemName_(kind,tidy(p.size),color)});}
  const state=state_(),code=code_(p.code),name=txt_(p.name,100),spec=txt_(p.spec,100),location=txt_(p.location,60),safety=int_(p.safety,0);
  if(!name)fail_('품목명을 입력하세요.');
  const sh=state.ss.getSheetByName(CFG.ITEMS),schema=itemSchema_(sh);requireItemSchema_(sh,schema);
  const raw=rows_(sh,schema.headers.length),index=raw.findIndex(r=>normalizeCode_(r[0])===code),active=p.active!==false;
  const existing=index>=0?raw[index]:null;
  const unit=txt_(p.unit===undefined?(existing?.[3]||'EA'):p.unit,20);
  if(!unit)fail_('단위를 입력하세요.');
  const category=category_(p.category===undefined?existing?.[schema.category]:p.category);
  const memo=p.memo===undefined?String(existing?.[9]||''):txt_(p.memo,250);
  // v3.0 확장 칸
  const ex=schema.extra;
  const size=p.size===undefined?String(existing&&ex.size>=0?existing[ex.size]:'').trim():sizeFmt_(txt_(p.size,30));
  const orderCode=p.orderCode===undefined?String(existing&&ex.order>=0?existing[ex.order]:'').trim():txt_(p.orderCode,20).toUpperCase();
  const photo=p.photo===undefined?String(existing&&ex.photo>=0?existing[ex.photo]:'').trim():photoUrl_(p.photo);
  const baseLength=p.baseLength===undefined?(existing&&ex.base>=0?lenCell_(existing[ex.base]):0):len_(p.baseLength,false);
  if(index<0){
    if(Object.prototype.hasOwnProperty.call(state.aliases,code))fail_('이 코드는 예전 QR과 입출고 기록이 연결된 이전 품목코드이므로 다시 사용할 수 없습니다.');
    if(p.edit)fail_('수정할 품목이 없습니다.');
    appendItem_(sh,schema,{code:code,name:name,spec:spec,unit:unit,location:location,start:int_(p.start,0),safety:safety,active:active,memo:memo,category:category,
      size:size,orderCode:orderCode,photo:photo,baseLength:baseLength,kind:kind||'',color:color||''});
  }else{
    if(!p.edit)fail_('이미 등록된 코드입니다. 품목 수정을 이용하세요.');
    if(p.version!==itemVersion_(existing,schema))fail_('다른 사용자가 품목을 수정했습니다. 새로고침하세요.');
    const item=state.items.find(i=>i.code===code);
    if(item&&baseLength!==item.baseLength&&item.lengthTagged)
      fail_('이미 길이별 기록이 있어 기본 길이를 바꿀 수 없습니다. 길이별 수량은 실사 조정으로 맞추세요.');
    sh.getRange(index+2,2,1,4).setValues([[cell_(name),cell_(spec),cell_(unit),cell_(location)]]);
    sh.getRange(index+2,8,1,3).setValues([[safety,active,cell_(memo)]]);
    sh.getRange(index+2,schema.category+1).setValues([[category]]);
    if(ex.size>=0)sh.getRange(index+2,ex.size+1).setValue(cell_(size));
    if(ex.order>=0)sh.getRange(index+2,ex.order+1).setValue(cell_(orderCode));
    if(ex.photo>=0)sh.getRange(index+2,ex.photo+1).setValue(photo);
    if(ex.base>=0)sh.getRange(index+2,ex.base+1).setValue(baseLength||'');
    if(kind!==undefined&&ex.kind>=0)sh.getRange(index+2,ex.kind+1).setValue(cell_(kind));
    if(color!==undefined&&ex.color>=0)sh.getRange(index+2,ex.color+1).setValue(cell_(color));
    // F 초기재고 / G 수식 / A 품목코드는 수정하지 않음.
  }
  SpreadsheetApp.flush();return {ok:true,code:code};
});}
/** 관리자 전용. 실제 입출고내역 행은 수정하지 않고 이전코드 → 신규코드 이력만 추가합니다. */
function renameItemCode(p, accessToken){const user=auth_(accessToken);admin_(user);return renameCore_(p,user,false);}
function renameCore_(p,user,skipVersion){return locked_(function(){
  const s=state_(),oldCode=code_(p.oldCode),newCode=code_(p.newCode);
  if(oldCode===newCode)fail_('현재 코드와 새로운 코드가 같습니다.');
  const item=s.items.find(i=>i.code===oldCode);
  if(!item)fail_('변경할 품목이 없습니다. 목록을 새로고침하세요.');
  if(s.items.some(i=>i.code===newCode))fail_('이미 등록된 품목코드입니다: '+newCode);
  if(Object.prototype.hasOwnProperty.call(s.aliases,newCode))fail_('이전에 사용된 코드여서 다시 사용할 수 없습니다: '+newCode);
  if(s.logs.some(r=>normalizeCode_(r[2])===newCode))fail_('입출고내역에 이미 사용된 코드입니다: '+newCode);
  const sh=s.ss.getSheetByName(CFG.ITEMS),raw=rows_(sh,10);
  const index=raw.findIndex(r=>normalizeCode_(r[0])===oldCode);
  if(index<0)fail_('원본 품목 행을 찾지 못했습니다.');
  const schema=itemSchema_(sh),current=rows_(sh,schema.headers.length)[index];
  if(!skipVersion&&String(p.version||'')!==itemVersion_(current,schema))fail_('다른 사용자가 품목을 수정했습니다. 새로고침 후 변경하세요.');
  const row=index+2,cell=sh.getRange(row,1),formulaCell=sh.getRange(row,7);
  const beforeCode=cell.getValue(),beforeFormula=formulaCell.getFormula();
  const journal=ensureRenameSheet_(s.ss),eventRow=journal.getLastRow()+1;
  let eventWritten=false,codeWritten=false,formulaWritten=false;
  try{
    journal.appendRow([new Date(),oldCode,newCode,user.email]);
    SpreadsheetApp.flush();eventWritten=true;
    cell.setValue(newCode);SpreadsheetApp.flush();codeWritten=true;
    const newAliases=readRenameData_(s.ss).aliases;
    formulaCell.setFormula(stockFormula_(row,newCode,newAliases));
    SpreadsheetApp.flush();formulaWritten=true;
  }catch(error){
    const repair=[];
    try{if(codeWritten||normalizeCode_(cell.getValue())===newCode){cell.setValue(beforeCode);SpreadsheetApp.flush();}}catch(e){repair.push('품목 A'+row+' 복구 실패');}
    try{if(formulaWritten||formulaCell.getFormula()!==beforeFormula){if(beforeFormula)formulaCell.setFormula(beforeFormula);else formulaCell.clearContent();SpreadsheetApp.flush();}}catch(e){repair.push('품목 G'+row+' 수식 복구 실패');}
    try{if(eventWritten || journal.getLastRow()>=eventRow){
      if(journal.getLastRow()>=eventRow && normalizeCode_(journal.getRange(eventRow,2).getValue())===oldCode && normalizeCode_(journal.getRange(eventRow,3).getValue())===newCode){journal.deleteRow(eventRow);SpreadsheetApp.flush();}
    }}catch(e){repair.push(CFG.RENAMES+'!'+eventRow+'행 복구 실패');}
    if(repair.length)fail_('품목코드 변경 중 일부 작업이 실패했습니다. '+repair.join(', ')+'. 추가 변경하지 말고 관리자에게 문의하세요. 원인: '+String(error.message||error));
    fail_('품목코드 변경을 적용하지 못했습니다. 원본 코드를 복구했습니다. 원인: '+String(error.message||error));
  }
  return {ok:true,oldCode:oldCode,newCode:newCode,stock:item.stock};
});}

// [v2.6 변경 E] idx<0 및 1행 삭제 방지. 코드 비교는 정규화.
function deleteUnusedItem(p, accessToken){return locked_(function(){
  admin_(auth_(accessToken));const state=state_(),code=code_(p.code),item=state.items.find(i=>i.code===code);
  if(!item)fail_('삭제할 품목을 찾지 못했습니다. 삭제하지 않았습니다.');
  if(item.stock!==0||state.logs.some(r=>resolveCode_(r[2],state.directAliases)===code)||Object.values(state.aliases).includes(code))fail_('재고·입출고 이력·코드 변경 이력이 있는 품목은 삭제할 수 없습니다. 사용 중지하세요.');
  const sh=state.ss.getSheetByName(CFG.ITEMS),raw=rows_(sh,10),idx=raw.findIndex(r=>normalizeCode_(r[0])===code);
  if(idx<0)fail_('대상 행을 찾지 못했습니다. 삭제하지 않았습니다.');
  const row=idx+2;if(row<=1||row>sh.getLastRow())fail_('제목 줄 또는 잘못된 행은 삭제할 수 없습니다.');
  sh.deleteRow(row);
  rows_(sh,10).forEach((r,i)=>{if(r[0])sh.getRange(i+2,7).setFormula(stockFormula_(i+2,r[0],state.aliases));});
  SpreadsheetApp.flush();return {ok:true};
});}

// [v2.6 추가 A] 품목 A~J의 순서/기존 확장 열을 보존. 빈 분류는 원장.
const MATERIAL_CATEGORIES=Object.freeze(['원장','기타 자재','확인 필요']);
function category_(value){const c=String(value??'').trim()||'원장';if(!MATERIAL_CATEGORIES.includes(c))fail_('분류는 원장 / 기타 자재 / 확인 필요 중에서 선택하세요.');return c;}
function itemSchema_(sh){
  const headers=sh&&sh.getLastRow()?sh.getRange(1,1,1,Math.max(10,sh.getLastColumn())).getDisplayValues()[0]:CFG.ITEM_HEADERS.slice();
  if(headers.slice(0,10).join('|')!==CFG.ITEM_HEADERS.join('|'))fail_('품목 A~J열 제목이 기존 형식과 다릅니다.');
  const found=[];headers.forEach((h,i)=>{if(String(h).trim()==='분류')found.push(i);});
  if(found.length>1)fail_('품목에 분류 열 제목이 중복됩니다.');
  if(found.length)return {headers:headers,category:found[0],extra:itemExtra_(headers)};
  if(headers[10]&&String(headers[10]).trim())fail_('품목 K열에 다른 데이터가 있습니다. 백업 후 빈 열을 확보하세요. 기존 값을 덮어쓰지 않습니다.');
  if(sh&&sh.getLastRow()>1&&rows_(sh,Math.max(11,headers.length)).some(r=>String(r[10]??'').trim()))fail_('품목 K열에 제목 없는 데이터가 있습니다. 먼저 확인하세요.');
  headers[10]='분류';return {headers:headers,category:10,extra:itemExtra_(headers)};
}
/** v3.0 확장 열(크기·기본길이·주문코드·사진)은 제목으로 찾습니다. 없으면 -1. */
function itemExtra_(headers){
  const f=name=>{const m=[];headers.forEach((h,i)=>{if(String(h).trim()===name)m.push(i);});if(m.length>1)fail_('품목에 '+name+' 열 제목이 중복됩니다.');return m.length?m[0]:-1;};
  return {size:f('크기'),base:f('기본길이(mm)'),order:f('주문코드'),photo:f('사진'),kind:f('종류'),color:f('색상')};
}
function requireItemSchema_(sh,schema){if(sh.getLastColumn()<=schema.category||String(sh.getRange(1,schema.category+1).getDisplayValues()[0][0]).trim()!=='분류')fail_('먼저 setupInventory를 실행해 분류 열을 준비하세요.');
  const ex=schema.extra;if(ex.size<0||ex.base<0||ex.order<0||ex.photo<0)fail_('시트 메뉴 ARCHICELL 자재관리 > 길이 관리 전환 (v3, 1회)을 먼저 실행하세요.');}
function itemVersion_(r,schema){const ex=schema.extra||{};const x=i=>i>=0?(r[i]??''):'';
  return JSON.stringify([r[1],r[2],r[3],r[4],r[7],r[8],r[9],r[schema.category]||'',x(ex.size),x(ex.base),x(ex.order),x(ex.photo),x(ex.kind),x(ex.color)]);}
function appendItem_(sh,schema,item){const row=Array(schema.headers.length).fill('');[item.code,cell_(item.name),cell_(item.spec),cell_(item.unit),cell_(item.location),item.start,'',item.safety,item.active!==false,cell_(item.memo||'')].forEach((v,i)=>row[i]=v);row[schema.category]=item.category;
  const ex=schema.extra||{};
  if(ex.size>=0)row[ex.size]=cell_(item.size||'');if(ex.base>=0)row[ex.base]=item.baseLength||'';
  if(ex.order>=0)row[ex.order]=cell_(item.orderCode||'');if(ex.photo>=0)row[ex.photo]=item.photo||'';
  if(ex.kind>=0)row[ex.kind]=cell_(item.kind||'');if(ex.color>=0)row[ex.color]=cell_(item.color||'');
  sh.appendRow(row);sh.getRange(sh.getLastRow(),7).setFormula(stockFormula_(sh.getLastRow(),item.code));}
/** 사진 주소: https만 허용. 구글 드라이브 공유 링크는 바로 보이는 썸네일 주소로 바꿉니다. */
function photoUrl_(v){
  const s=String(v??'').trim().slice(0,500);if(!s)return '';
  if(!/^https:\/\/[^\s"'<>]+$/.test(s))fail_('사진 주소는 https:// 로 시작하는 주소만 넣을 수 있습니다.');
  const m=s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/);
  return m?'https://drive.google.com/thumbnail?id='+m[1]+'&sz=w1600':s;
}

// [v2.6 추가 G] 초기 데이터. 등록 전 previewInitialMaterials_ 실행 권장.
function initialMaterials_(){return [
 {code:'3060-BK-2250',legacy:'PF-3060-A1B',name:'3060프로파일 검정',spec:'30*60 / 2250mm',unit:'EA',start:75,category:'기타 자재'},
 {code:'3060-BK-940',legacy:'PF-3060-A2B',name:'3060프로파일 검정',spec:'30*60 / 940mm',unit:'EA',start:82,category:'기타 자재'},
 {code:'3060-BK-540',legacy:'PF-3060-A3B',name:'3060프로파일 검정',spec:'30*60 / 540mm',unit:'EA',start:8,category:'기타 자재'},
 {code:'2040-SV-2400',name:'2040프로파일 실버',spec:'20*40 / 2400mm',unit:'EA',start:60,category:'원장'},
 {code:'20100-SV-2400',name:'20100프로파일 실버',spec:'20*100 / 2400mm',unit:'EA',start:10,category:'원장'},
 {code:'3030-SV-2400',name:'3030프로파일 실버',spec:'30*30 / 2400mm',unit:'EA',start:70,category:'원장'},
 {code:'3060-SV-2400',name:'3060프로파일 실버',spec:'30*60 / 2400mm',unit:'EA',start:270,category:'원장'},
 {code:'30120-SV-2400',name:'30120프로파일 실버',spec:'30*120 / 2400mm',unit:'EA',start:24,category:'원장'},
 {code:'TMP-A01',name:'이름 미확인 1',spec:'규격 확인 필요',unit:'EA',start:25,category:'확인 필요'},
 {code:'TMP-A02',name:'이름 미확인 2',spec:'규격 확인 필요',unit:'EA',start:8,category:'확인 필요'}
];}
function planInitialMaterials_(state){return initialMaterials_().map(seed=>{
 const seedCurrent=resolveCode_(seed.code,state.directAliases);
 const legacyCurrent=seed.legacy?resolveCode_(seed.legacy,state.directAliases):'';
 const exact=state.items.find(i=>i.code===seedCurrent),legacy=seed.legacy&&state.items.find(i=>i.code===legacyCurrent);
 if(exact&&legacy&&exact.code!==legacy.code)fail_('같은 자재의 새 코드와 이전 코드가 모두 있습니다: '+seed.code+' / '+seed.legacy+'. 중복 여부를 먼저 확인하세요.');
 const existing=exact||legacy,code=existing?existing.code:seed.code;
 if(!existing&&state.logs.some(r=>normalizeCode_(r[2])===code))fail_('품목은 없지만 기존 기록에 코드가 있습니다: '+code+'. 신규 초기재고를 넣지 않습니다.');
 const updateMetadata=!!legacy&&!exact&&!legacy.categoryExplicit;
 return {code:code,requestedCode:seed.code,action:existing?(updateMetadata?'기존 코드 유지 · 미분류 자재의 이름/규격/분류 갱신':'기존 품목 유지 · 덮어쓰기 없음'):'신규 등록',updateMetadata:updateMetadata,currentStock:existing?existing.stock:seed.start,referenceQuantity:seed.start,existing:!!existing,seed:seed};
});}
function previewInitialMaterials_(){return locked_(function(){admin_(editorAuth_());const plan=planInitialMaterials_(state_());console.log(JSON.stringify(plan,null,2));return plan;});}
function importInitialMaterials_(){return locked_(function(){
 admin_(editorAuth_());const state=state_(),sh=state.ss.getSheetByName(CFG.ITEMS),schema=itemSchema_(sh);requireItemSchema_(sh,schema);
 // 모든 충돌을 쓰기 전에 검사. 반복 실행해도 기존 초기재고/단위를 덮어쓰거나 신규 행을 중복 생성하지 않음.
 const plan=planInitialMaterials_(state),raw=rows_(sh,schema.headers.length);
 plan.forEach(entry=>{const seed=entry.seed;if(entry.existing){
   if(!entry.updateMetadata)return;
   const idx=raw.findIndex(r=>normalizeCode_(r[0])===entry.code);if(idx<0)fail_('기존 품목 행을 찾지 못했습니다.');
   sh.getRange(idx+2,2,1,2).setValues([[cell_(seed.name),cell_(seed.spec)]]);
   sh.getRange(idx+2,schema.category+1).setValues([[seed.category]]);
 }else appendItem_(sh,schema,{...seed,location:'',safety:0,active:true,memo:''});});
 SpreadsheetApp.flush();console.log(JSON.stringify(plan,null,2));return {ok:true,created:plan.filter(p=>!p.existing).length,preserved:plan.filter(p=>p.existing).length,plan:plan};
});}


// ===== v2.9 전용 주소 앱 연결 / 품목코드 안전장치 =====
// 새 앱 주소는 프로젝트 설정 > 스크립트 속성 ARCHICELL_APP_URL 에 저장합니다.
// 이 값이 비어 있으면 기존 방식(이 /exec 주소에서 바로 열기)으로 그대로 동작합니다.
function publicUrl_(){
  const v=String(PropertiesService.getScriptProperties().getProperty('ARCHICELL_APP_URL')||'').trim();
  return /^https:\/\/[^\s"'<>]+$/.test(v)?v:'';
}
function renderIndex_(sku,action){
  const t=HtmlService.createTemplateFromFile('Index');
  t.initialSku=sku;t.initialAction=action;
  return t.evaluate().getContent();
}
function htmlEsc_(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/** 예전 QR 라벨(이 /exec 주소)로 들어오면 새 앱 주소로 안내합니다. */
function redirectPage_(base,sku,action){
  const q=[];if(sku)q.push('sku='+encodeURIComponent(sku));if(action)q.push('action='+encodeURIComponent(action));
  const url=base+(q.length?(base.includes('?')?'&':'?')+q.join('&'):'');
  const html='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Malgun Gothic",sans-serif;background:#f3f5f4;color:#1d3633;display:flex;min-height:100vh;align-items:center;justify-content:center}'+
    '.box{max-width:360px;margin:20px;padding:28px;background:#fff;border-radius:16px;text-align:center;border:1px solid #dfe6e2}'+
    'a{display:block;margin-top:18px;padding:16px;border-radius:12px;background:#246a55;color:#fff;font-weight:700;font-size:18px;text-decoration:none}</style></head><body>'+
    '<div class="box"><small>ARCHICELL / STOCK</small><h2>재고관리 앱으로 이동</h2><p>재고관리 주소가 바뀌었습니다. 아래 버튼을 누르세요.</p>'+
    (sku?'<p><b>'+htmlEsc_(sku)+'</b></p>':'')+
    '<a href="'+htmlEsc_(url)+'" target="_top">재고관리 열기</a></div>'+
    '<script>try{window.top.location.href='+JSON.stringify(url).replace(/</g,'\\u003c')+';}catch(e){}<\/script></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('ARCHICELL 자재관리').addMetaTag('viewport','width=device-width, initial-scale=1');
}
/** 새 앱 주소에서 보내는 요청 통로. 허용된 기능만 실행합니다. */
function doPost(e){
  const api={loginCompany:loginCompany,getDashboard:getDashboard,saveTransaction:saveTransaction,adjustStock:adjustStock,
    cancelTransaction:cancelTransaction,updateLogMemo:updateLogMemo,getHistory:getHistory,saveItem:saveItem,renameItemCode:renameItemCode,deleteUnusedItem:deleteUnusedItem,
    cutStock:cutStock,uploadPhoto:uploadPhoto,saveItemAll:saveItemAll,setItemPhoto:setItemPhoto,uiMutate:uiMutate};
  let out;
  try{
    const raw=String(e&&e.postData&&e.postData.contents||'');
    // 사진 올리기만 큰 요청을 허용합니다(휴대폰에서 줄여서 보냄).
    if(raw.length>4000000)fail_('요청이 너무 큽니다.');
    const body=JSON.parse(raw||'{}'),fn=String(body.fn||'');
    if(!Object.prototype.hasOwnProperty.call(api,fn))fail_('지원하지 않는 요청입니다.');
    const args=Array.isArray(body.args)?body.args.slice(0,4):[];
    const photoRequest=fn==='uploadPhoto'||(fn==='uiMutate'&&args[0]==='uploadPhoto');
    if(raw.length>(photoRequest?4000000:100000))fail_('요청이 너무 큽니다.');
    out={ok:true,result:api[fn].apply(null,args)};
  }catch(err){out={ok:false,error:String(err&&err.message||err)};}
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/** 시트 메뉴: 선택한 행의 품목코드를 기록 유지 방식으로 변경합니다. */
function renameCodeFromSheet_(){
  const ui=SpreadsheetApp.getUi();
  try{
    const user=editorAuth_();admin_(user);
    const sh=SpreadsheetApp.getActiveSheet(),row=sh.getActiveRange().getRow();
    if(sh.getName()!==CFG.ITEMS||row<2)fail_('품목 시트에서 바꿀 품목의 행(아무 칸)을 먼저 선택하세요.');
    const oldCode=normalizeCode_(sh.getRange(row,1).getValue());
    if(!oldCode)fail_('선택한 행에 품목코드가 없습니다.');
    const res=ui.prompt('품목코드 변경 (기록 유지)','현재 코드: '+oldCode+'\n\n새 코드를 입력하세요. 예: 3060-BK-2250\n기존 입출고 기록과 예전 QR 라벨은 새 코드로 자동 연결됩니다.',ui.ButtonSet.OK_CANCEL);
    if(res.getSelectedButton()!==ui.Button.OK)return;
    const r=renameCore_({oldCode:oldCode,newCode:res.getResponseText()},user,true);
    ui.alert('변경 완료: '+r.oldCode+' → '+r.newCode+'\n재고 '+r.stock+' · 기존 기록과 예전 QR 유지');
  }catch(err){ui.alert(String(err&&err.message||err));}
}

/** 품목 시트 A열(품목코드)을 직접 고쳤을 때의 안전장치.
 *  - 입출고 기록이나 변경 이력이 있는 코드: 원래 값으로 되돌리고 메뉴 사용을 안내
 *  - 기록이 없는 코드: 변경을 허용하고 G열 재고 수식을 새 코드로 맞춤 */
/** v3.3 시트에서 직접 고친 내용 자동 반영.
 *  - 품목코드(A열)를 바꾸면: '기록 유지' 방식으로 자동 변경(변경 이력 추가 · 예전 QR 연결 · 재고 수식 갱신)
 *  - 새 줄에 품목코드를 쓰면: 재고 수식(G열)을 자동으로 넣음
 *  - 쓸 수 없는 코드(형식 오류·중복·예전 코드)는 원래대로 되돌리고 이유를 알려줌
 *  - 다른 칸(품목명·크기·길이·주문코드·사진·위치 등)은 앱이 열릴 때마다 시트를 그대로 읽으므로 따로 할 일이 없음 */
function onEdit(e){
  try{
    if(!e||!e.range)return;
    const range=e.range,sh=range.getSheet();
    if(sh.getName()!==CFG.ITEMS)return;
    if(range.getColumn()>1||range.getLastRow()<2)return;
    const ss=e.source||sh.getParent();
    const single=range.getNumRows()===1&&range.getNumColumns()===1;
    if(!single){
      ss.toast('품목코드 칸을 여러 개 한꺼번에 바꿨다면, 메뉴 ARCHICELL 자재관리 > 재고 수식 점검을 실행하세요.','품목코드 확인',10);
      return;
    }
    const row=range.getRow(),oldCode=normalizeCode_(e.oldValue),newCode=normalizeCode_(range.getValue());
    if(oldCode===newCode)return;
    const logSh=ss.getSheetByName(CFG.LOG);
    const logCodes=logSh&&logSh.getLastRow()>1?logSh.getRange(2,3,logSh.getLastRow()-1,1).getValues().map(r=>normalizeCode_(r[0])):[];
    const ren=readRenameData_(ss);
    const used=!!oldCode&&logCodes.includes(oldCode);
    const linked=!!oldCode&&(Object.prototype.hasOwnProperty.call(ren.direct,oldCode)||Object.keys(ren.aliases).some(k=>ren.aliases[k]===oldCode));
    const back=msg=>{if(e.oldValue===undefined)range.clearContent();else range.setValue(e.oldValue);ss.toast(msg,'품목코드 확인',12);};
    if(!newCode){
      if(used||linked)back('기록이 있는 품목은 코드를 지울 수 없어 되돌렸습니다. 쓰지 않으면 I열 사용을 체크 해제하세요.');
      return;
    }
    let reason='';
    if(!/^[A-Z0-9][A-Z0-9_-]{1,39}$/.test(newCode)||!/[A-Z]/.test(newCode))reason='코드는 영문 1자 이상 포함, 2~40자(영문·숫자·-·_)여야 합니다.';
    else if(Object.prototype.hasOwnProperty.call(ren.direct,newCode))reason='예전에 쓰던 코드라 다시 쓸 수 없습니다.';
    else if(logCodes.includes(newCode))reason='입출고 기록에 이미 있는 코드입니다.';
    else if(sh.getRange(2,1,Math.max(1,sh.getLastRow()-1),1).getValues().some((r,i)=>i+2!==row&&normalizeCode_(r[0])===newCode))reason='다른 품목이 이미 쓰는 코드입니다.';
    if(reason){back(reason+(oldCode?' 원래 코드('+oldCode+')로 되돌렸습니다.':' 입력을 지웠습니다.'));return;}
    if(String(range.getValue())!==newCode)range.setValue(newCode);
    let aliases=ren.aliases;
    if(oldCode){
      // 기존 코드: 변경 이력에 남겨 기존 기록·이미 붙인 QR 라벨을 새 코드로 연결
      ensureRenameSheet_(ss).appendRow([new Date(),oldCode,newCode,'sheet:'+String(Session.getActiveUser().getEmail()||'편집자')]);
      aliases=readRenameData_(ss).aliases;
    }
    sh.getRange(row,7).setFormula(stockFormula_(row,newCode,aliases));
    ss.toast(oldCode?'코드를 바꿨습니다: '+oldCode+' → '+newCode+' · 기존 기록과 예전 QR이 새 코드로 연결됩니다.':'새 품목 '+newCode+'의 재고 수식을 넣었습니다.','품목코드',8);
  }catch(err){
    try{e.source.toast(String(err&&err.message||err),'품목코드 확인 필요',10);}catch(ignore){}
  }
}

/** 입출고내역에는 있는데 품목 목록에 없는 코드(시트에서 코드를 직접 바꾼 흔적)를 관리자에게 알립니다. */
function dashboardWarnings_(s){
  const known=new Set(s.items.map(i=>i.code)),orphan=Object.create(null);
  s.logs.forEach(r=>{const c=resolveCode_(r[2],s.directAliases);if(c&&!known.has(c))orphan[c]=(orphan[c]||0)+1;});
  return Object.keys(orphan).slice(0,10).map(c=>'[코드 확인] 입출고내역에 품목 목록에 없는 코드 '+c+'의 기록이 '+orphan[c]+'건 있습니다. 품목 시트에서 코드를 직접 바꿨다면 원래 코드로 되돌린 뒤, 품목코드 변경 기능으로 바꾸세요.');
}

/* ===================== v3.0 사진 올리기 ===================== */
/** 관리자 전용. 휴대폰에서 줄인 JPEG를 드라이브 'ARCHICELL 자재사진' 폴더에 저장하고 품목의 사진 칸에 주소를 넣습니다. */
function uploadPhoto(p, accessToken){
  const u=auth_(accessToken);admin_(u);
  const code=code_(p&&p.code),data=String(p&&p.data||'');
  if(!data||data.length>3800000||!/^[A-Za-z0-9+/=]+$/.test(data))fail_('사진 파일을 확인하세요. (최대 약 2.5MB)');
  const s=state_(),item=s.items.find(i=>i.code===resolveCode_(code,s.directAliases));if(!item)fail_('품목을 찾을 수 없습니다.');
  const sh=s.ss.getSheetByName(CFG.ITEMS),schema=itemSchema_(sh);requireItemSchema_(sh,schema);
  // v3.9: 폴더 검색 없이 저장된 폴더 ID로 저장합니다. 드라이브 오류는 알아듣기 쉬운 문구로 바꿉니다.
  let file;
  try{
    const folder=photoFolder_();
    const stamp=Utilities.formatDate(new Date(),'Asia/Seoul','yyyyMMdd-HHmmss');
    file=folder.createFile(Utilities.newBlob(Utilities.base64Decode(data),'image/jpeg',item.code+'_'+stamp+'.jpg'));
  }catch(e){photoDriveFail_(e);}
  if(!file||!file.getSize())fail_('사진 파일이 비어 있습니다. 다른 사진으로 다시 시도하세요.');
  // 로그인하지 않은 직원 휴대폰에서도 보이도록 '링크가 있는 사람 보기'로 둡니다. (이 사진 파일 하나만 공유)
  try{file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);}catch(e){}
  const url='https://drive.google.com/thumbnail?id='+file.getId()+'&sz=w1600';
  return locked_(function(){
    const raw=rows_(sh,schema.headers.length),index=raw.findIndex(r=>normalizeCode_(r[0])===item.code);
    if(index<0)fail_('품목 행을 찾지 못했습니다.');
    sh.getRange(index+2,schema.extra.photo+1).setValue(url);SpreadsheetApp.flush();
    return {ok:true,code:item.code,photo:url};
  });
}

/* ===================== v3.9 사진 폴더 ===================== */
/** 사진 폴더: 저장해 둔 ID의 폴더를 쓰고, 없으면 새로 만들어 ID를 저장합니다. 폴더 이름으로 검색하지 않습니다. */
function photoFolder_(){
  const props=PropertiesService.getScriptProperties(),id=props.getProperty('ARCHICELL_PHOTO_FOLDER_ID');
  if(id){
    try{const f=DriveApp.getFolderById(id);if(!f.isTrashed())return f;}
    catch(e){if(/권한|permission|scope|authoriz/i.test(String(e&&e.message||e)))throw e;}
  }
  const folder=DriveApp.createFolder(CFG.PHOTO_FOLDER);
  props.setProperty('ARCHICELL_PHOTO_FOLDER_ID',folder.getId());
  return folder;
}
/** 드라이브 오류를 사용자가 이해할 수 있는 문구로 바꿉니다. */
function photoDriveFail_(e){
  const m=String(e&&e.message||e);
  if(m.indexOf('[확인]')>=0)throw e;
  if(/권한|permission|scope|authoriz|auth\//i.test(m))
    fail_('사진 저장 권한이 아직 승인되지 않았습니다. 관리자가 Apps Script 편집기에서 setupPhotoFolder 를 한 번 실행해 권한을 승인한 뒤, 새 버전으로 다시 배포해 주세요. (품목 정보는 바뀌지 않았습니다)');
  fail_('사진을 구글 드라이브에 저장하지 못했습니다. 잠시 후 다시 시도해 주세요. (품목 정보는 바뀌지 않았습니다) · '+m.slice(0,160));
}
/** [편집기에서 1회 실행] 드라이브 권한 승인 + 사진 폴더 준비. 실행 로그에 폴더 주소가 나옵니다. 기존 데이터는 건드리지 않습니다. */
function setupPhotoFolder(){
  const folder=photoFolder_();
  const msg='사진 폴더 준비 완료: '+folder.getName()+' · '+folder.getUrl();
  Logger.log(msg);return msg;
}

/* ===================== v3.6 사진 주소 바꾸기·지우기 ===================== */
/** 관리자 전용. 품목 시트의 '사진' 칸만 바꿉니다. photo를 비우면 사진이 지워집니다(드라이브 파일은 그대로 남습니다). */
function setItemPhoto(p, accessToken){
  const u=auth_(accessToken);admin_(u);p=p||{};
  const code=code_(p.code),photo=photoUrl_(p.photo);
  return locked_(function(){
    const s=state_(),item=s.items.find(i=>i.code===resolveCode_(code,s.directAliases));
    if(!item)fail_('품목을 찾을 수 없습니다.');
    const sh=s.ss.getSheetByName(CFG.ITEMS),schema=itemSchema_(sh);requireItemSchema_(sh,schema);
    const raw=rows_(sh,schema.headers.length),index=raw.findIndex(r=>normalizeCode_(r[0])===item.code);
    if(index<0)fail_('품목 행을 찾지 못했습니다.');
    sh.getRange(index+2,schema.extra.photo+1).setValue(photo);SpreadsheetApp.flush();
    return {ok:true,code:item.code,photo:photo};
  });
}

/* ===================== v3.0 길이 관리 전환 (메뉴에서 1회) ===================== */
/* 여러 번 실행해도 이미 된 작업은 건너뜁니다. 기존 입출고 기록은 수정·삭제하지 않습니다.
 * 1) 품목 시트에 크기 / 기본길이(mm) / 주문코드 / 사진 열, 입출고내역에 길이(mm) 열 추가
 * 2) 수입 코드 정리: 코드 뒤 크기 표기를 떼어 냄 (기록 유지 방식 · 예전 QR 그대로 연결)
 * 3) 규격 칸의 '30*60 / 2250mm'를 크기 30x60, 기본길이 2250으로 나눔
 * 4) 길이만 다른 같은 품목(검정 3060)을 QL-333 하나로 합침: 시작 수량은 '기초재고' 기록으로 옮김
 */
const V3_RENAMES=[['QL-333-30X60','QL-333'],['QL-325-3030','QL-325'],['QL-378-3030','QL-378']];
const V3_DETAILS={'QL-333':{size:'30x60',order:'M187'},'QL-325':{size:'30x30',order:'M114'},'QL-378':{size:'30x30',order:'M117'}};
const V3_MERGE=[['PF-3060-A2B','QL-333'],['PF-3060-A3B','QL-333']];
function migrateLengthsV3_(){
  const ui=SpreadsheetApp.getUi();
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  if(!ss||ss.getId()!==getBook_().getId())fail_('재고 시트(확장 프로그램 → Apps Script)에서 실행하세요.');
  const ok=ui.alert('길이 관리 전환 (v3)','다음 작업을 합니다. 기존 입출고 기록은 지우지 않습니다.\n\n'+
    '1) 품목 시트에 크기·기본길이·주문코드·사진 열, 입출고내역에 길이 열 추가\n'+
    '2) 코드 정리: '+V3_RENAMES.map(x=>x[0]+'→'+x[1]).join(', ')+'\n'+
    '3) 규격 칸을 크기와 기본 길이로 나눔\n'+
    '4) '+V3_MERGE.map(x=>x[0]).join(', ')+' 을(를) '+V3_MERGE[0][1]+' 품목의 길이로 합침\n\n'+
    '시작 전에 파일 → 사본 만들기로 백업을 권장합니다. 진행할까요?',ui.ButtonSet.OK_CANCEL);
  if(ok!==ui.Button.OK)return;
  const email=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase()||'editor';
  const user={name:'전환작업',email:'migration:'+email,admin:true};
  const done=[];
  try{
    // 1) 열 추가
    locked_(function(){
      const items=ss.getSheetByName(CFG.ITEMS),log=ss.getSheetByName(CFG.LOG);
      const schema=itemSchema_(items);requireItemSchemaBase_(items,schema);
      CFG.ITEM_EXTRA.forEach(name=>{if(addHeader_(items,name))done.push('품목 열 추가: '+name);});
      logSchema_(log);
      if(addHeader_(log,CFG.LOG_LENGTH))done.push('입출고내역 열 추가: '+CFG.LOG_LENGTH);
      SpreadsheetApp.flush();
    });
    // 2) 코드 정리 (기록 유지 방식)
    V3_RENAMES.forEach(pair=>{
      const s=state_();
      if(s.items.some(i=>i.code===pair[0])&&!s.items.some(i=>i.code===pair[1])){
        renameCore_({oldCode:pair[0],newCode:pair[1]},user,true);done.push('코드 변경: '+pair[0]+' → '+pair[1]);
      }
    });
    // 3) 규격 → 크기 / 기본길이, 주문코드
    locked_(function(){
      const items=ss.getSheetByName(CFG.ITEMS),schema=itemSchema_(items),ex=schema.extra;
      const raw=rows_(items,schema.headers.length);
      raw.forEach((r,i)=>{
        const code=normalizeCode_(r[0]);if(!code)return;
        const row=i+2,spec=String(r[2]||'');let changed=false;
        const sm=spec.match(/(\d+)\s*[*xX×]\s*(\d+)/),lm=spec.match(/(\d+)\s*mm/i);
        const known=V3_DETAILS[code]||{};
        if(!String(r[ex.size]??'').trim()){
          const size=known.size||(sm?sm[1]+'x'+sm[2]:'');
          if(size){items.getRange(row,ex.size+1).setValue(size);changed=true;}
        }
        if(!lenCell_(r[ex.base])&&lm){items.getRange(row,ex.base+1).setValue(Number(lm[1]));changed=true;}
        if(!String(r[ex.order]??'').trim()&&known.order){items.getRange(row,ex.order+1).setValue(known.order);changed=true;}
        if(sm||lm){
          const rest=spec.replace(sm?sm[0]:'','').replace(lm?lm[0]:'','').replace(/[\/·,|]+/g,' ').replace(/\s+/g,' ').trim();
          if(rest!==spec.trim()){items.getRange(row,3).setValue(cell_(rest));changed=true;}
        }
        if(changed)done.push('크기·길이 정리: '+code);
      });
      SpreadsheetApp.flush();
    });
    // 4) 같은 품목 합치기
    V3_MERGE.forEach(pair=>{
      const msg=mergeLengthItem_(ss,pair[0],pair[1],user);if(msg)done.push(msg);
    });
    // 5) 재고 수식 다시 맞춤
    locked_(function(){
      const sh=ss.getSheetByName(CFG.ITEMS),aliases=readRenameData_(ss).aliases;
      rows_(sh,10).forEach((r,i)=>{if(r[0])sh.getRange(i+2,7).setFormula(stockFormula_(i+2,r[0],aliases));});
      SpreadsheetApp.flush();
    });
    state_(); // 마지막 검사: 오류가 있으면 아래에서 알림
  }catch(err){
    ui.alert('전환 중 멈춤','완료된 작업:\n'+(done.join('\n')||'(없음)')+'\n\n멈춘 이유: '+String(err&&err.message||err)+'\n\n원인을 고친 뒤 다시 실행하면 남은 작업만 이어서 합니다.',ui.ButtonSet.OK);
    return;
  }
  ui.alert('길이 관리 전환 완료',(done.join('\n')||'이미 전환되어 있어 바꾼 것이 없습니다.')+'\n\n이제 배포 → 배포 관리 → 수정 → 새 버전 → 배포를 해주세요.',ui.ButtonSet.OK);
}
function requireItemSchemaBase_(sh,schema){if(sh.getLastColumn()<=schema.category||String(sh.getRange(1,schema.category+1).getDisplayValues()[0][0]).trim()!=='분류')fail_('먼저 메뉴의 설치 / v2 업그레이드를 실행해 분류 열을 준비하세요.');}
/** 1행에 제목이 없으면 오른쪽 끝 다음 칸에 추가합니다. 추가했으면 true. */
function addHeader_(sh,name){
  const width=Math.max(1,sh.getLastColumn()),headers=sh.getRange(1,1,1,width).getDisplayValues()[0];
  if(headers.some(h=>String(h).trim()===name))return false;
  let col=width+1;
  // 제목 없는 오른쪽 칸 중, 아래에 데이터가 없는 첫 칸을 씁니다.
  for(let c=width;c>=1;c--){if(String(headers[c-1]).trim())break;col=c;}
  if(sh.getLastRow()>1){
    while(sh.getRange(2,col,sh.getLastRow()-1,1).getDisplayValues().some(v=>String(v[0]).trim()))col++;
  }
  if(sh.getMaxColumns()<col)sh.insertColumnsAfter(sh.getMaxColumns(),col-sh.getMaxColumns());
  sh.getRange(1,col).setValue(name);return true;
}
/** fromCode 품목을 intoCode 품목의 한 길이로 합칩니다. 입출고 기록이 있는 품목은 합치지 않습니다. */
function mergeLengthItem_(ss,fromCode,intoCode,user){return locked_(function(){
  const s=state_(),from=s.items.find(i=>i.code===fromCode),into=s.items.find(i=>i.code===intoCode);
  if(!from)return '';
  if(!into)fail_(fromCode+'을 합칠 '+intoCode+' 품목이 없습니다.');
  if(s.logs.some(r=>resolveCode_(r[2],s.directAliases)===fromCode))fail_(fromCode+'에 입출고 기록이 있어 자동으로 합치지 않습니다. 실사 조정으로 옮겨주세요.');
  if(Object.values(s.aliases).includes(fromCode))fail_(fromCode+'에 코드 변경 이력이 연결되어 있어 자동으로 합치지 않습니다.');
  if(!into.baseLength)fail_(intoCode+'의 기본 길이가 없습니다.');
  const mm=from.baseLength;
  if(!mm)fail_(fromCode+'의 길이를 알 수 없습니다(규격 칸에 ○○mm 필요).');
  if(mm===into.baseLength)fail_(fromCode+'와 '+intoCode+'의 길이가 같습니다('+mm+'mm). 수량을 직접 확인하세요.');
  const items=ss.getSheetByName(CFG.ITEMS),raw=rows_(items,10),idx=raw.findIndex(r=>normalizeCode_(r[0])===fromCode);
  if(idx<0)fail_(fromCode+' 행을 찾지 못했습니다.');
  // 시작 수량을 합칠 품목의 '기초재고' 기록으로 옮김 (0이면 기록 없음)
  if(from.start>0){
    const id='mg_'+Utilities.getUuid().replace(/-/g,'');
    writeLogs_(s,user,into,[{id:id,type:'기초재고',qty:from.start,delta:from.start,memo:'길이 관리 전환: '+fromCode+' 합침',target:'',length:mm}],
      signature_(['migration',fromCode,intoCode,mm,from.start]));
  }
  items.deleteRow(idx+2);SpreadsheetApp.flush();
  // 예전 QR(fromCode)도 새 품목으로 연결
  ensureRenameSheet_(ss).appendRow([new Date(),fromCode,intoCode,user.email]);SpreadsheetApp.flush();
  return '합침: '+fromCode+' ('+mm+'mm '+from.start+displayUnit_(from.unit)+') → '+intoCode;
});}


/* ===================== v3.3 품목 한 번에 수정 ===================== */
/** 관리 화면 '품목 저장' 한 번으로: 품목코드 변경(기록 유지) → 정보 저장 → 길이별 수량(실사 조정)까지 처리합니다. */
function saveItemAll(p, accessToken){
  const u=auth_(accessToken);admin_(u);p=p||{};
  if(!p.edit)return saveItem(p,accessToken);
  const oldCode=code_(p.oldCode),code=code_(p.code);
  const done=[];
  if(oldCode!==code){renameCore_({oldCode:oldCode,newCode:code,version:p.version},u,false);done.push('코드 '+oldCode+' → '+code);}
  try{saveItem(Object.assign({},p,{code:code}),accessToken);done.push('정보 저장');}
  catch(e){fail_((done.length?done.join(', ')+'까지는 완료됐고, ':'')+'정보 저장에서 멈췄습니다: '+String(e.message||e).replace(/^Error: /,'').replace('[확인] ',''));}
  let adjusted=0;
  if(Array.isArray(p.counts)&&p.counts.length){
    try{adjusted=adjustMany_(code,p.counts,String(p.stockVersion||''),u,request_(p));}
    catch(e){fail_(done.join(', ')+'까지는 완료됐고, 수량 수정에서 멈췄습니다: '+String(e.message||e).replace(/^Error: /,'').replace('[확인] ',''));}
    if(adjusted)done.push('수량 '+adjusted+'건 실사 조정');
  }
  return {ok:true,code:code,oldCode:oldCode,renamed:oldCode!==code,adjusted:adjusted,summary:done.join(' · ')};
}
/** 여러 길이의 수량을 한 번에 실사 조정합니다. 같은 요청을 다시 보내도 두 번 기록하지 않습니다. */
function adjustMany_(code,counts,stockVersion,u,rid){return locked_(function(){
  const s=state_(),item=s.items.find(i=>i.code===resolveCode_(code,s.directAliases));
  if(!item||!item.active)fail_('사용 가능한 품목이 아닙니다.');
  if(s.logs.some(r=>String(r[1]).indexOf(rid+'_a')===0))return 0;
  if(item.version!==stockVersion)fail_('수정 화면을 연 뒤 재고가 바뀌었습니다. 새로고침 후 수량을 다시 확인하세요.');
  if(counts.length>30)fail_('한 번에 30개 길이까지 수정할 수 있습니다.');
  const seen=Object.create(null),entries=[];
  counts.forEach((c,k)=>{
    const mm=item.hasLength?len_(c&&c.length,true):0,count=int_(c&&c.count,0);
    if(seen[mm])fail_((mm?mm+'mm ':'')+'수량이 두 번 들어왔습니다.');seen[mm]=true;
    const cur=lengthStock_(item,mm);
    if(count!==cur)entries.push({id:rid+'_a'+(k+1),type:'실사조정',qty:count,delta:count-cur,memo:'품목 수정 화면에서 수량 수정',target:'',length:mm});
  });
  if(!entries.length)return 0;
  writeLogs_(s,u,item,entries,signature_([u.email,item.code,'수량일괄',JSON.stringify(counts),stockVersion]));
  return entries.length;
});}
/* ===== v3.8 UI: 기존 저장 함수를 그대로 사용하고 확정 데이터를 같은 응답에 반환 ===== */
function uiMutate(method, payload, accessToken) {
  const allowed = {
    saveTransaction: saveTransaction, cutStock: cutStock,
    cancelTransaction: cancelTransaction, adjustStock: adjustStock, updateLogMemo: updateLogMemo,
    saveItemAll: saveItemAll, saveItem: saveItem,
    renameItemCode: renameItemCode, deleteUnusedItem: deleteUnusedItem,
    uploadPhoto: uploadPhoto, setItemPhoto: setItemPhoto
  };
  if (!Object.prototype.hasOwnProperty.call(allowed, method)) fail_('지원하지 않는 저장 작업입니다.');
  // 각 기존 함수에서 인증·권한·중복요청·재고 검증을 수행합니다.
  // 여기서 추가 잠금을 잡지 않습니다(기존 함수의 잠금과 중첩 방지).
  const result = allowed[method](payload, accessToken);
  try {
    return {result: result, dashboard: getDashboard(accessToken), refreshError: false};
  } catch (e) {
    // 저장 후 조회 오류를 저장 실패로 보내면 중복 입력을 유발할 수 있습니다.
    return {result: result, dashboard: null, refreshError: true};
  }
}
