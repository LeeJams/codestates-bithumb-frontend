<template>
  <div class="container">
    <HeaderInfo :coinData="coinData" />
    <ChartView :coinData="coinData" />
    <section class="row justify-around q-mt-xl">
      <q-table
        class="q-pa-lg col-5"
        title="체결내역"
        :rows="transactionData"
        :columns="transactionColumns"
        row-key="time"
        dark
        hide-bottom
        style="height: 400px"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="time" :props="props">
              {{ props.row.time }}
            </q-td>
            <q-td key="price" :props="props">
              {{ props.row.price }}
            </q-td>
            <q-td
              key="qty"
              :props="props"
              :class="props.row.qty === 'up' ? 'redColor' : 'blueColor'"
            >
              <span>{{ props.row.qty }}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
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
  TickerContent,
  ChartData,
} from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ChartView from "@/components/ChartView.vue";
import { numberFormat } from "@/utils/common";
import HeaderInfo from "./coin-components/HeaderInfo.vue";

const route = useRoute();
const transactionData = ref<
  { time: string; price: string; qty: string; updn: string }[]
>([]);
const orderbookData = ref<OrderbookContents[]>([]);
const coinData = ref<TickerContent>();
const askList = ref<{ price: string; quantity: string }[]>([]);
const bidList = ref<{ price: string; quantity: string }[]>([]);

const transactionColumns = [
  {
    name: "time",
    align: "center",
    label: "시간",
    field: "time",
  },
  {
    name: "price",
    align: "right",
    label: "현재가",
    field: "price",
  },
  {
    name: "qty",
    align: "right",
    label: "수량",
    field: "qty",
  },
];

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
        // askList.value.push({ price, quantity });
      } else if (orderType === "bid") {
        // bidList.value.push({ price, quantity });
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
