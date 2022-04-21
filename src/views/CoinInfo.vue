<template>
  <div class="container">
    <HeaderInfo :coinData="coinData" />
    <!-- <ApexChart /> -->
    <ChartView />
    <section class="row justify-around q-mt-xl">
      <TransactionDataTable :transactionData="transactionData" />
      <OrderbookDataTable
        :askList="Object.entries(askList).reverse().slice(0, 10)"
        :bidList="Object.entries(bidList).reverse().slice(0, 10)"
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
  CoinHeaderData,
} from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ChartView from "@/components/ChartView.vue";
// import ApexChart from "@/components/ApexChart.vue";
import { numberFormat } from "@/utils/common";
import HeaderInfo from "./coin-components/HeaderInfo.vue";
import http from "@/utils/http";
import TransactionDataTable from "./coin-components/TransactionDataTable.vue";
import OrderbookDataTable from "./coin-components/OrderbookDataTable.vue";

const route = useRoute();
const transactionData = ref<
  { time: string; price: string; qty: string; updn: string }[]
>([]);
const coinData = ref<CoinHeaderData>();
const askList = ref<{ [key in string]: number }>({});
const bidList = ref<{ [key in string]: number }>({});

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
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

const onOpen = () => {
  socket.value.send(transaction);
  socket.value.send(orderbook);
  socket.value.send(ticker);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data?.type === "transaction") {
    const { contDtm, contPrice, contQty, updn } = data.content
      .list[0] as TransactionContents;
    transactionData.value = [
      {
        time: contDtm.substring(10, 19),
        price: numberFormat(contPrice),
        qty: `${contQty.substring(0, 6)}BTC`,
        updn,
      },
      ...transactionData.value.slice(0, 19),
    ];
  } else if (data?.type === "orderbookdepth") {
    const res = data.content.list as OrderbookContents[];
    for (let i = 0; i < res.length; i++) {
      const { orderType, price, quantity } = res[i];
      if (orderType === "ask") {
        askList.value[price] = parseFloat(quantity);
        const forFilter = Object.entries(askList.value);
        askList.value = Object.fromEntries(
          forFilter.filter((n) => n[1] !== 0).slice(0, 20)
        );
      } else if (orderType === "bid") {
        bidList.value[price] = parseFloat(quantity);
        const forFilter = Object.entries(bidList.value);
        bidList.value = Object.fromEntries(
          forFilter.filter((n) => n[1] !== 0).slice(0, 20)
        );
      }
    }
  } else if (data?.type === "ticker") {
    const { lowPrice, highPrice, openPrice, closePrice, chgRate, chgAmt } =
      data.content as TickerContent;
    coinData.value = {
      lowPrice,
      highPrice,
      openPrice,
      closePrice,
      chgRate,
      chgAmt,
    };
  }
};

const initTransactionData = async () => {
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
const initTickerData = async () => {
  try {
    const result: RestTickerData = await http.get(
      `/ticker/${route.params.symbol}_KRW`
    );
    coinData.value = {
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
const initOrderbookData = async () => {
  try {
    // CORS 애러
    // const result: RestOrderbookData = await http.get(
    //   `/orderbook/${route.params.symbol}_KRW`
    // );
    // console.log(result);
  } catch (e) {
    console.log(e);
  }
};

onMounted(() => {
  socket.value.onopen = function () {
    onOpen();
  };

  socket.value.onmessage = function (event: MessageEvent) {
    onMessage(event);
  };

  initTransactionData();
  initTickerData();
  initOrderbookData();
});
onBeforeUnmount(() => {
  socket.value.close();
});
</script>
