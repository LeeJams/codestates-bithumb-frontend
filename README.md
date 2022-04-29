# codestates-bithumb-frontend

빗썸 테크 아카데미 (FE 심화 과정)-기술 과제

### 완성된 GIF 파일 및 배포 링크

https://leejams.github.io/codestates-bithumb-frontend/

<hr />

### 프로젝트 실행 방법

##### Project Setup

```sh
npm install
```

##### Project Start

```sh
npm run dev
```

<hr />

### 사용한 스택 목록

<ul>
  <li>VueJs 3 - Vite</li>
  <li>TypeScript</li>
  <ul>
    <li>Apex Charts</li>
    <li>Chart.js</li>
    <li>Chart.js - Chart - Financial</li>
    <li>Quasar</li>
    <li>Axios</li>
  </ul>
</ul>

<hr />

### 구현한 기능 목록 (Software Requirement Specification)

1. 빗썸의 Public API (REST, WebSocket)를 활용하여 빗썸에서 서비스되고 있는 모든 코인의 정보와 실시간 가격정보를 볼 수 있습니다.
2. Chart.js / ApexChart 를 활용하여 코인 가격에 대한 정보를 CandleStick Chart로 보여주고있습니다.
3. 선택한 코인의 실시간 체결내역과 호가창을 실시간으로 보여주고있습니다.


<hr />

### 구현 방법 및 구현하면서 어려웠던 점

**구현방법**

* React를 권장하였지만 시간과 구현의 난이도를 생각해 익숙한 VueJS를 사용하여 구현하였습니다.

* VueJs에서 권장하기 시작한 UI 프레임워크인 Quasar를 처음으로 사용해봤습니다.

* Rest API와 WebSocket API를 적극적으로 사용했습니다.

* 개발자들의 눈 보호를 위해 다크모드로 구성했습니다.

**구현 중 어려웠던 점**

* Chart를 실시간으로 업데이트 시키는 것이 너무 어려웠습니다. REST API와 WebSocket API를 적절히 사용해서 구현하려 했지만 Canvas redraw과정이 생각보다 느려서 많은 고민을 했습니다.

### 성능 최적화에 대해서 고민하고 개선한 방법

* 처음 차트를 그릴때 REST API 중 Candlestick API 를 사용하였는데 많은 데이터에 너무 느렸습니다.
  * 데이터를 필요한 만큼만 자른다음 차트를 그리게 하여 개선했습니다.

