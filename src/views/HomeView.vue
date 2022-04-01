<template>
  <div class="container">
    <div class="logo"></div>
    <div style="display: flex">
      <CardView :coinData="btcCoinData" title="BitCoin - 비트코인"></CardView>
      <CardView :coinData="ethCoinData" title="Ethereum - 이더리움"></CardView>
    </div>
    <div style="display: flex; justify-content: space-around">
      <ChartView :series="btcChartData" title="비트코인" />
      <ChartView :series="ethChartData" title="이더리움" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CoinContent, CoinTickerData } from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import ChartView from "@/components/ChartView.vue";
import CardView from "@/components/CardView.vue";

const btcCoinData = ref<CoinContent>();
const ethCoinData = ref<CoinContent>();
const btcTime = ref(true);
const ethTime = ref(true);

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const param = JSON.stringify({
  type: "ticker",
  symbols: ["BTC_KRW", "ETH_KRW"],
  tickTypes: ["30M"],
});

const btcChartData = ref<{ data: { x: string; y: number[] }[] }[]>([
  { data: [] },
]);
const ethChartData = ref<{ data: { x: string; y: number[] }[] }[]>([
  { data: [] },
]);

const onOpen = () => {
  socket.value.send(param);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data) as CoinTickerData;
  console.log(data);
  if (data?.content) {
    if (data?.content.symbol === "BTC_KRW") {
      btcCoinData.value = data.content;

      if (btcTime.value) {
        btcTime.value = false;
        btcChartData.value[0].data.push({
          x: data.content.time,
          y: [
            Number(data.content.openPrice),
            Number(data.content.highPrice),
            Number(data.content.lowPrice),
            Number(data.content.closePrice),
          ],
        });
        setTimeout(() => {
          btcTime.value = true;
        }, 2000);
      }

      if (btcChartData.value[0].data.length > 600) {
        btcChartData.value = btcChartData.value.splice(50);
      }
    } else if (data?.content.symbol === "ETH_KRW") {
      ethCoinData.value = data.content;

      if (ethTime.value) {
        ethTime.value = false;
        ethChartData.value[0].data.push({
          x: data.content.time,
          y: [
            Number(data.content.openPrice),
            Number(data.content.highPrice),
            Number(data.content.lowPrice),
            Number(data.content.closePrice),
          ],
        });
        setTimeout(() => {
          ethTime.value = true;
        }, 2000);
      }

      if (ethChartData.value[0].data.length > 600) {
        ethChartData.value = ethChartData.value.splice(50);
      }
    }
  }
};

onMounted(() => {
  socket.value.onopen = function () {
    onOpen();
  };

  socket.value.onmessage = function (event: MessageEvent) {
    onMessage(event);
  };
});
onBeforeUnmount(() => {
  socket.value.onclose;
});
</script>

<style>
.container {
  width: 70%;
  margin: 0 auto;
}
.logo {
  width: 132px;
  height: 39px;
  background-image: url(https://www.bithumb.com/resources/img/sprite/sp_main_new.png?v=bithumb.2.0.5);
  background-repeat: no-repeat;
  margin: 50px auto;
}
</style>
