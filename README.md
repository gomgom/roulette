# Marble roulette

This is a lucky draw by dropping marbles.

[페이지 주소 (GitHub Pages 활성화 후)](https://gomgom.github.io/roulette/)

## 광고 없는 포크

- 시작 전 광고, 맵 광고판, 결과 화면 광고와 광고 조회/노출 전송을 제거했습니다.
- 원작자의 Umami 분석 및 Google Analytics 이벤트, 쇼핑몰 버튼, 홍보 공지를 제거했습니다.
- 구슬 추첨, 맵 선택, 당첨 범위, 녹화, 결과창 닫기는 유지합니다.
- 이름에 따라 이미지를 보여주는 `KeywordService`는 광고 기능과 별개이므로 유지합니다.
  이 기능은 여전히 원작자의 쇼핑몰 서버에서 키워드/스프라이트를 읽습니다.
- 원작자 저작권 표시와 MIT 라이선스는 유지합니다.

## GitHub Pages 배포

1. 포크의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
2. 포크의 Actions가 비활성화되어 있으면 활성화합니다.
3. 변경 사항을 `main`에 반영하거나 **Actions → Build and Deploy → Run workflow**를 실행합니다.
4. 배포 작업이 성공하면 https://gomgom.github.io/roulette/ 에서 사용합니다.

별도 서버나 API 키는 필요하지 않습니다. `yarn build`는 `/roulette/` 경로를 사용합니다.
저장소 이름이나 사용자 지정 도메인을 바꾸면 `--public-url`과 페이지 메타데이터도 함께 바꾸세요.
GitHub Pages 설정 전에는 배포 단계가 실패할 수 있습니다.

## 검증

```sh
yarn install --frozen-lockfile
yarn test
yarn build
yarn check:no-ads
```

테스트는 페이지 초기화, 광고 대기 없는 시작, 녹화 시작 순서, 중복 시작 방지 및
결과창 닫기 버튼을 확인합니다. 빌드 검사는 광고/분석 코드와 누락된 정적 파일을 확인합니다.
브라우저에서 실제 구슬 경주와 녹화 다운로드를 끝까지 검증하는 테스트는 아닙니다.

# Requirements

- Typescript
- Parcel
- box2d-wasm

# Development

```shell
> yarn
> yarn dev
```

# Build

```shell
> yarn build
```
