<template>
  <div class="container">
    <header>
      <h4>비트코인 {{ route.params.coinName }}</h4>
      <div style="display: flex; justify-content: space-evenly">
        <p><b>시</b><span>55771000</span></p>
        <p><b>고</b><span>55771000</span></p>
        <p><b>저</b><span>55771000</span></p>
        <p><b>종</b><span>55771000</span></p>
        <p><b>전일대비</b><span>55771000</span></p>
      </div>
    </header>
    <ChartView />
    <section
      style="display: flex; justify-content: space-evenly; margin-top: 30px"
    >
      <div style="width: 45%; height: 500px; border: 1px solid; padding: 15px">
        <p>체결내역</p>
        <div style="overflow: auto; height: 90%">
          <table style="width: 100%">
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
      <div style="width: 45%; height: 500px; border: 1px solid; padding: 15px">
        <p>모아보기</p>
        <div style="overflow: auto; height: 90%">
          <table style="width: 100%">
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
import type { TransactionContents, OrderbookContents } from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ChartView from "@/components/ChartView.vue";

const numberFormat = (number: string) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(Number(number));
};

const route = useRoute();
const transactionData = ref<TransactionContents[]>([]);
const orderbookData = ref<OrderbookContents[]>([]);
const columns = [
  {
    name: "contDtm",
    label: "체결시각",
    field: "contDtm",
  },
  {
    name: "contAmt",
    label: "체결금액",
    field: "contDtm",
  },
  {
    name: "contQty",
    label: "체결가격",
    field: "contQty",
  },
  { name: "symbol", label: "통화코드", field: "symbol" },
];

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const transaction = JSON.stringify({
  type: "transaction",
  symbols: [route.params.coinName],
});
const orderbook = JSON.stringify({
  type: "orderbookdepth",
  symbols: [route.params.coinName],
});

const onOpen = () => {
  socket.value.send(transaction);
  socket.value.send(orderbook);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data?.type === "transaction") {
    transactionData.value = [
      data.content.list[0],
      ...transactionData.value.slice(0, 19),
    ];
  } else if (data?.type === "orderbookdepth") {
    orderbookData.value = data.content.list;
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
