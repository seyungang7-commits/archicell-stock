# ARCHICELL 재고관리 — Apps Script 코드 보관

구글 시트 "ARHCICELL 공장 재고관리"의 확장 프로그램 → Apps Script에 들어가는 코드입니다.
이 폴더는 보관용이며, GitHub Pages 앱(index.html)은 이 파일을 직접 쓰지 않습니다.

- `Code.gs` — 서버 코드 (v3.9: v3.8 uiMutate + 사진 폴더를 이름 검색 없이 ID로 사용 · 드라이브 권한 오류 수정 · 권한 승인용 `setupPhotoFolder`)
- `Index.html` — 화면 코드 (v3.9: 회사 로고 헤더(휴대폰은 정중앙) · 여백/요약 카드/재고 목록 정리 · 품목 사진 간편 등록(파일 선택·Ctrl+V·끌어다 놓기))
- `QRLib`, `appsscript.json`은 Apps Script에 있는 그대로 사용합니다.

## 적용 방법
1. Apps Script에서 `Code.gs`, `Index.html` 내용을 이 파일로 통째로 교체 → 저장
2. 배포 → 배포 관리 → 연필(수정) → 새 버전 → 배포

(화면은 GitHub Pages 앱이 배포된 Apps Script에서 받아오므로, 위 2단계만 하면 반영됩니다. GitHub Pages 쪽 index.html은 바꿀 필요 없습니다.)

비밀번호는 코드에 없고 Apps Script의 스크립트 속성에만 있습니다.

## v3.9 적용 순서 (사진 권한 포함)
1. Apps Script의 `Code.gs`, `Index.html`을 이 폴더 파일로 통째로 교체 → 저장
2. 프로젝트 설정 → "편집기에서 appsscript.json 매니페스트 파일 표시" 체크 → appsscript.json에 `"oauthScopes"`가 있으면 목록에 `"https://www.googleapis.com/auth/drive"` 한 줄 추가
3. 편집기 위쪽 함수 목록에서 `setupPhotoFolder` 선택 → 실행 → 권한 승인
4. 배포 → 배포 관리 → 연필 → 버전: 새 버전 → 배포 (웹 앱 주소는 그대로)
