<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
    />
  </div>
</template>

<script setup lang="ts">
import type { Transaction, TransactionContents } from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const param = JSON.stringify({
  type: "transaction",
  symbols: [route.params.coinName],
});

const rows = ref<TransactionContents[]>([]);
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

const onOpen = () => {
  socket.value.send(param);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data) as Transaction;
  console.log(data);
  if (data?.contents?.list) {
    rows.value.push(data.contents.list[0]);
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
