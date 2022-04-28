<template>
  <div class="container">
    <div class="q-pa-md"></div>
    <HeaderInfo :tickerData="tickerData" />
    <ChartView :tickerData="tickerData" v-if="selectedChart === 'Chart.js'" />
    <ApexChart :tickerData="tickerData" v-else />
    <q-select
      v-model="selectedChart"
      :options="['Chart.js', 'ApexChart', 'VueTrade']"
      label="Kind of Chart"
      dark
      outlined
      style="max-width: 400px"
    />
    <section class="row justify-around q-mt-xl">
      <TransactionDataTable :transactionData="transactionData" />
      <OrderbookDataTable
        :askList="Object.entries(askList).slice(0, 10)"
        :bidList="Object.entries(bidList).slice(0, 10)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  TransactionContents,
  OrderbookContents,
  TickerContent,
  RestTransactionData,
  RestTickerData,
  ConvertedTickerData,
} from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ChartView from "@/components/ChartView.vue";
import ApexChart from "@/components/ApexChart.vue";
import { numberFormat } from "@/utils/common";
import HeaderInfo from "./coin-components/HeaderInfo.vue";
import http from "@/utils/http";
import TransactionDataTable from "./coin-components/TransactionDataTable.vue";
import OrderbookDataTable from "./coin-components/OrderbookDataTable.vue";

const route = useRoute();

const tickerData = ref<ConvertedTickerData>();
const askList = ref<{ [key in string]: number }>({});
const bidList = ref<{ [key in string]: number }>({});
const transactionData = ref<
  { time: string; price: string; qty: string; updn: string }[]
>([]);

const selectedChart = ref("Chart.js");

const setInitTransactionData = async () => {
  try {
    const result: RestTransactionData = await http.get(
      `/transaction_history/${route.params.symbol}_KRW`
    );
    transactionData.value = result.data.map((n) => ({
      time: n.transaction_date.substring(10, 19),
      price: numberFormat(n.price),
      qty: `${n.units_traded.substring(0, 6)}BTC`,
      updn: n.type === "ask" ? "up" : "dn",
    }));
  } catch (e) {
    console.log(e);
  }
};

const setInitTickerData = async () => {
  try {
    const result: RestTickerData = await http.get(
      `/ticker/${route.params.symbol}_KRW`
    );
    tickerData.value = {
      lowPrice: result.data.min_price,
      openPrice: result.data.opening_price,
      highPrice: result.data.max_price,
      closePrice: result.data.closing_price,
      chgRate: result.data.fluctate_rate_24H,
      chgAmt: result.data.fluctate_24H,
    };
  } catch (e) {
    console.log(e);
  }
};

const setInitOrderbookData = async () => {
  // CORS 애러
  // try {
  //   const result: RestOrderbookData = await http.get(
  //     `/orderbook/${route.params.symbol}_KRW`
  //   );
  //   console.log(result);
  // } catch (e) {
  //   console.log(e);
  // }
};

const setSocketTransactionData = (data: TransactionContents) => {
  transactionData.value = [
    {
      time: data.contDtm.substring(10, 19),
      price: numberFormat(data.contPrice),
      qty: `${data.contQty.substring(0, 6)}BTC`,
      updn: data.updn,
    },
    ...transactionData.value.slice(0, 19),
  ];
};

const setSocketOrderbookData = (orderbooks: OrderbookContents[]) => {
  for (let i = 0; i < orderbooks.length; i++) {
    const { orderType, price, quantity } = orderbooks[i];

    if (orderType === "ask") {
      askList.value[price] = parseFloat(quantity);
      const forFilter = Object.entries(askList.value);
      askList.value = Object.fromEntries(
        forFilter
          .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
          .filter((n) => n[1] !== 0)
          .slice(0, 20)
      );
    } else if (orderType === "bid") {
      bidList.value[price] = parseFloat(quantity);
      const forFilter = Object.entries(bidList.value);
      bidList.value = Object.fromEntries(
        forFilter
          .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
          .filter((n) => n[1] !== 0)
          .slice(0, 20)
      );
    }
  }
};

const setSocketTickerData = (data: TickerContent) => {
  const { lowPrice, highPrice, openPrice, closePrice, chgRate, chgAmt } = data;
  tickerData.value = {
    lowPrice,
    highPrice,
    openPrice,
    closePrice,
    chgRate,
    chgAmt,
  };
};

const transaction = JSON.stringify({
  type: "transaction",
  symbols: [`${route.params.symbol}_KRW`],
});
const orderbook = JSON.stringify({
  type: "orderbookdepth",
  symbols: [`${route.params.symbol}_KRW`],
});
const ticker = JSON.stringify({
  type: "ticker",
  symbols: [`${route.params.symbol}_KRW`],
  tickTypes: ["24H"],
});

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);

  if (data?.type === "transaction") {
    const transaction = data.content.list[0] as TransactionContents;
    setSocketTransactionData(transaction);
  } else if (data?.type === "orderbookdepth") {
    const orderbooks = data.content.list as OrderbookContents[];
    setSocketOrderbookData(orderbooks);
  } else if (data?.type === "ticker") {
    const ticker = data.content as TickerContent;
    setSocketTickerData(ticker);
  }
};

const socket = ref();
const connectSocket = () => {
  socket.value = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

  socket.value.onopen = function () {
    socket.value.send(transaction);
    socket.value.send(orderbook);
    socket.value.send(ticker);
  };

  socket.value.onmessage = function (event: MessageEvent) {
    onMessage(event);
  };
};

onMounted(() => {
  try {
    setInitTransactionData();
    setInitTickerData();
    setInitOrderbookData();
    connectSocket();
  } catch (e) {
    console.log(e);
    alert(
      "코인 정보를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요"
    );
  }
});

onBeforeUnmount(() => {
  socket.value.close();
});
</script>
