<template>
  <q-card
    class="my-card text-white"
    :style="bgColor"
    @click="$router.push(`/${coinData.symbol}`)"
    style="cursor: pointer"
  >
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <br />
      <div class="text-subtitle2">
        전일대비
        <span :style="dayToDay"
          >{{ coinData.chgRate }}% ({{
            Number(coinData.chgAmt).toLocaleString()
          }})</span
        >
      </div>
      <br />
      <div class="text-subtitle2">
        시
        <span :style="dayToDay">{{
          Number(coinData.openPrice).toLocaleString()
        }}</span>
      </div>
      <div class="text-subtitle2">
        고
        <span :style="dayToDay">{{
          Number(coinData.highPrice).toLocaleString()
        }}</span>
      </div>
      <div class="text-subtitle2">
        저
        <span :style="dayToDay">{{
          Number(coinData.lowPrice).toLocaleString()
        }}</span>
      </div>
      <div class="text-subtitle2">
        종
        <span :style="dayToDay">{{
          Number(coinData.closePrice).toLocaleString()
        }}</span>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none" v-if="coinData.symbol === 'BTC_KRW'">
      비트코인은 2009년 사토시 나카모토가 만든 가상화폐로, 통화를 발행하고
      관리하는 중앙 장치가 존재하지 않는 구조를 가지고 있다.<br />
      대신, 비트코인의 거래는 P2P 기반 분산 데이터베이스에 의해 이루어지며, 공개
      키 암호 방식 기반으로 거래를 수행한다.<br />비트코인은 지갑 파일의 형태로
      저장되며, 이 지갑에는 각각의 고유 주소가 부여되며, 그 주소를 기반으로
      비트코인의 거래가 이루어진다.<br />
      비트코인은 1998년 웨이따이가 사이버펑크 메일링 리스트에 올린
      암호통화(cryptocurrency)란 구상을 최초로 구현한 것 중의 하나이다.
    </q-card-section>
    <q-card-section class="q-pt-none" v-else>
      이더리움은 2015년 7월 30일 비탈릭 부테린(Vitalik Buterin)이 개발하였다.<br />비탈릭
      부테린은 가상화폐인 비트코인에 사용된 핵심 기술인 블록체인에 화폐 거래
      기록뿐 아니라 계약서 등의 추가 정보를 기록할 수 있다는 점에 착안하여, 전
      세계 수많은 사용자들이 보유하고 있는 컴퓨팅 자원을 활용해 이더리움 가상
      머신(EVM)을 만들고, 이 플랫폼을 이용하여 SNS, 이메일, 전자투표 등 다양한
      정보를 기록하는 시스템을 창안했다.<br />
      이더리움은 C++, 자바, 파이썬, GO 등 주요 프로그래밍 언어를 지원한다.
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import type { CoinContent } from "@/types/dataType";
import { computed, type PropType } from "vue";

const props = defineProps({
  coinData: {
    type: Object as PropType<CoinContent>,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "",
  },
});

const dayToDay = computed(() =>
  Number(props.coinData.chgRate) > 0 ? "color: #f75467" : "color: #4386f9"
);

const bgColor = computed(() =>
  Number(props.coinData.chgRate) > 0
    ? "background: radial-gradient(circle, rgb(183 20 20) 0%, rgb(38 1 1) 100%);"
    : "background: radial-gradient(circle, rgb(15 63 103) 0%, rgb(1 21 38) 100%);"
);
</script>
