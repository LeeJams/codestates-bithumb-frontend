<template>
  <div class="container">
    <div class="logo"></div>
    <div style="display: flex">
      <TableView :coinData="btcCoinData" title="BitCoin - 비트코인"></TableView>
      <TableView
        :coinData="ethCoinData"
        title="Ethereum - 이더리움"
      ></TableView>
    </div>
    <ChartViewVue
      :btcChartData="btcChartData"
      :ethChartData="ethChartData"
    ></ChartViewVue>
  </div>
</template>
<script setup lang="ts">
import type { CoinContent, CoinTickerData } from "@/types/dataType";
import { onMounted, ref } from "vue";
import ChartViewVue from "@/components/ChartView.vue";
import TableView from "@/components/TableView.vue";

const btcCoinData = ref<CoinContent>();
const ethCoinData = ref<CoinContent>();

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const param = JSON.stringify({
  type: "ticker",
  symbols: ["BTC_KRW", "ETH_KRW"],
  tickTypes: ["24H"],
});

const btcChartData = ref<{ time: string; price: number }[]>([]);
const ethChartData = ref<{ time: string; price: number }[]>([]);

const onOpen = () => {
  socket.value.send(param);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data) as CoinTickerData;
  console.log(data);
  if (data?.content) {
    if (data?.content.symbol === "BTC_KRW") {
      if (ethChartData.value.length === btcChartData.value.length) {
        btcChartData.value.push({
          time: data.content.time,
          price: Number(data.content.chgRate),
        });
      }
      btcCoinData.value = data.content;

      if (btcChartData.value.length > 200) {
        btcChartData.value = btcChartData.value.splice(50);
      }
    } else if (data?.content.symbol === "ETH_KRW") {
      if (ethChartData.value.length <= btcChartData.value.length) {
        ethChartData.value.push({
          time: data.content.time,
          price: Number(data.content.chgRate),
        });
      }
      ethCoinData.value = data.content;

      if (ethChartData.value.length > 200) {
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
