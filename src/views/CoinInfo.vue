<template>
  <div class="container">
    <HeaderInfo :coinData="coinData" />
    <ChartView :coinData="coinData" />
    <section>
      <div class="item_box">
        <p>체결내역</p>
        <div class="item">
          <table>
            <thead>
              <th>시간</th>
              <th>가격(KRW)</th>
              <th>수량(BTC)</th>
            </thead>
            <tbody>
              <tr v-for="(data, idx) in transactionData" :key="idx">
                <td>{{ data.contDtm.substring(10, 19) }}</td>
                <td>{{ numberFormat(data.contPrice) }}</td>
                <td
                  :style="
                    data.updn === 'up' ? 'color: #f75467' : 'color: #4386f9'
                  "
                >
                  {{ data.contQty.substring(0, 6) }} BTC
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="item_box">
        <p>모아보기</p>
        <div class="item">
          <table>
            <thead>
              <th>가격(KRW)</th>
              <th>수량(BTC)</th>
            </thead>
            <tbody>
              <tr v-for="(data, idx) in orderbookData" :key="idx">
                <td>{{ numberFormat(data.price) }}</td>
                <td>{{ data.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  TransactionContents,
  OrderbookContents,
  CoinContent,
  ChartData,
} from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ChartView from "@/components/ChartView.vue";
import { numberFormat } from "@/utils/common";
import HeaderInfo from "./coin-components/HeaderInfo.vue";

const route = useRoute();
const transactionData = ref<TransactionContents[]>([]);
const orderbookData = ref<OrderbookContents[]>([]);
const coinData = ref<CoinContent>();
const askList = ref<{ price: string; quantity: string }[]>([]);
const bidList = ref<{ price: string; quantity: string }[]>([]);

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const transaction = JSON.stringify({
  type: "transaction",
  symbols: [route.params.symbol],
});
const orderbook = JSON.stringify({
  type: "orderbookdepth",
  symbols: [route.params.symbol],
});
const ticker = JSON.stringify({
  type: "ticker",
  symbols: [route.params.symbol],
  tickTypes: ["30M"],
});

const onOpen = () => {
  socket.value.send(transaction);
  socket.value.send(orderbook);
  socket.value.send(ticker);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data?.type === "transaction") {
    transactionData.value = [
      data.content.list[0],
      ...transactionData.value.slice(0, 19),
    ];
  } else if (data?.type === "orderbookdepth") {
    const res = data.content.list as OrderbookContents[];
    for (let i = 0; i < res.length; i++) {
      const { orderType, price, quantity } = res[i];
      if (orderType === "ask") {
        askList.value.push({ price, quantity });
      } else if (orderType === "bid") {
        bidList.value.push({ price, quantity });
      }
    }
  } else if (data?.type === "ticker") {
    coinData.value = data.content;
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
