# ARCHICELL 재고관리 — Apps Script 코드 보관

구글 시트 "ARHCICELL 공장 재고관리"의 확장 프로그램 → Apps Script에 들어가는 코드입니다.
이 폴더는 보관용이며, GitHub Pages 앱(index.html)은 이 파일을 직접 쓰지 않습니다.

- `Code.gs` — 서버 코드 (v3.5: 길이별 재고, 절단, 사진, 종류·색상, 한 번에 저장, 시트 직접 수정 자동 반영)
- `Index.html` — 화면 코드 (v3.6: 현황판, 빠른 입출고 창, 처리 알림)
- `QRLib`, `appsscript.json`은 Apps Script에 있는 그대로 사용합니다.

## 적용 방법
1. Apps Script에서 `Code.gs`, `Index.html` 내용을 이 파일로 통째로 교체 → 저장
2. 배포 → 배포 관리 → 연필(수정) → 새 버전 → 배포

비밀번호는 코드에 없고 Apps Script의 스크립트 속성에만 있습니다.
