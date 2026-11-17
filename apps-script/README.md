# ARCHICELL 재고관리 — Apps Script 코드 보관

구글 시트 "ARHCICELL 공장 재고관리"의 확장 프로그램 → Apps Script에 들어가는 코드입니다.
이 폴더는 보관용이며, GitHub Pages 앱(index.html)은 이 파일을 직접 쓰지 않습니다.

## 지금 들어 있는 버전 (2026-11-17)
- `Code.gs` — 서버 코드 **v4.1** (v4.0 + 조회 속도: 화면을 열 때 시트마다 한 번만 읽음)
- `Index.html` — 화면 코드 **v4.1** (저장 먼저 반영 · 직원용 간단 화면 · 라벨 배치 변경 / v4.0: 화면 전체 정리 · 중복 저장 방지)
- 저장소 맨 위 `index.html`(앱 껍데기) — **v3.0** (한 번 받은 화면을 기기에 저장해 두고 다음부터 바로 열기)
- 지난 버전 설명은 `CHANGELOG.md`, 지난 파일은 `archive/`에 있습니다.

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

## v3.10 적용 순서 (Code.gs와 Index.html 둘 다 교체)
1. Apps Script의 `Code.gs`, `Index.html`을 이 폴더 파일로 통째로 교체 → 저장
2. 배포 → 배포 관리 → 연필 → 버전: 새 버전 → 배포
- 기록 메모 수정 버튼은 Code v3.10이 배포되어야 나타납니다(이전 메모는 시트 셀 메모에 남습니다).

## v3.11 적용 순서 (Index.html만 교체, Code.gs는 v3.10 그대로)
1. Apps Script의 `Index.html`만 이 폴더 파일로 통째로 교체 → 저장 (Code.gs는 건드리지 않음)
2. 배포 → 배포 관리 → 연필 → 버전: 새 버전 → 배포
- 입고·출고 버튼을 누르면 "출고 확인 / 입고 확인" 창이 항상 먼저 뜹니다. [취소]를 누르면 저장되지 않습니다.
- QR 스캔 즉시 열기(앱을 새로 열지 않고 바로 입출고 창)는 GitHub Pages 쪽 `index.html`(껍데기 v2.9.7)에 들어 있습니다. 이 폴더의 파일이 아니라 저장소 맨 위 `index.html`이며, 따로 올려야 적용됩니다(archive/Shell_index_v2.9.7.html.txt 참고).

## v3.15 적용 순서 (Index.html만 교체, Code.gs는 v3.13 그대로)
1. Apps Script의 `Index.html`만 이 폴더 파일로 통째로 교체 → 저장 (Code.gs는 건드리지 않음)
2. 배포 → 배포 관리 → 연필 → 버전: 새 버전 → 배포
- 휴대폰(가로 760px 이하)에서만 모양이 바뀝니다. PC 화면은 그대로입니다. 데이터·동작은 바뀌지 않습니다.
- 되돌리기: `archive/Index_v3.14.txt`로 Index.html을 교체하고 새 버전 배포

## v3.16 적용 순서 (Index.html만 교체, Code.gs는 v3.13 그대로)
1. Apps Script의 `Index.html`만 이 폴더 파일로 통째로 교체 → 저장 (Code.gs는 건드리지 않음)
2. 배포 → 배포 관리 → 연필 → 버전: 새 버전 → 배포
- v3.15(폰 화면 정리)를 건너뛰어도 됩니다. v3.16에 포함되어 있습니다.
- 폰 현황 화면에 '간단히 / 자세히' 전환이 생깁니다. 처음에는 '간단히'. 고른 방식은 그 폰에 기억됩니다. PC 화면은 그대로입니다.
- 되돌리기: `archive/Index_v3.15.txt`(간단히 보기 없음) 또는 `archive/Index_v3.14.txt`(폰 정리 전)로 Index.html 교체 → 새 버전 배포
