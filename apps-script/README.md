# ARCHICELL 재고관리 — Apps Script 코드 보관

구글 시트 "ARHCICELL 공장 재고관리"의 확장 프로그램 → Apps Script에 들어가는 코드입니다.
이 폴더는 보관용이며, GitHub Pages 앱(index.html)은 이 파일을 직접 쓰지 않습니다.

- `Code.gs` — 서버 코드 (v3.6: v3.5 + 큰 사진 저장 w1600, 사진 주소 바꾸기·지우기 `setItemPhoto`)
- `Index.html` — 화면 코드 (v3.8: 품목코드와 같은 카탈로그 이미지를 사진이 없는 품목에 자동 표시, 품목 등록창에서 코드를 입력하면 이미지 미리보기·사진 주소로 넣기 / v3.7: 큰 사진, 사진 확대·바꾸기(Ctrl+V·끌어놓기·선택·촬영), 현황에서 바로 정보 수정, 알루미늄 그레이·블랙 색상)
- `QRLib`, `appsscript.json`은 Apps Script에 있는 그대로 사용합니다.

## 적용 방법
1. Apps Script에서 `Code.gs`, `Index.html` 내용을 이 파일로 통째로 교체 → 저장
2. 배포 → 배포 관리 → 연필(수정) → 새 버전 → 배포

(화면은 GitHub Pages 앱이 배포된 Apps Script에서 받아오므로, 위 2단계만 하면 반영됩니다. GitHub Pages 쪽 index.html은 바꿀 필요 없습니다.)

비밀번호는 코드에 없고 Apps Script의 스크립트 속성에만 있습니다.

## 카탈로그 이미지 (v3.8)
- 저장소 루트 `catalog/` 폴더에 품목코드별 이미지(QL-001.jpg 등)가 있고, GitHub Pages 주소로 앱이 불러옵니다.
- 七乐(칠락) 2022 전자카탈로그 PDF에서 칸별로 잘라 워터마크를 지운 이미지입니다. 코드가 카탈로그에 없으면 이미지가 뜨지 않습니다.
- 등록한 사진(사진 칸)이 있으면 그 사진이 우선입니다.
