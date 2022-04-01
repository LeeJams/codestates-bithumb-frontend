<template>
  <div class="q-pa-md">
    <q-table class="my-sticky-header-column-table" title="Treats" />
  </div>
</template>

<script setup lang="ts">
import type { CoinContent, CoinTickerData } from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const btcCoinData = ref<CoinContent>();
const ethCoinData = ref<CoinContent>();
const btcTime = ref(true);
const ethTime = ref(true);

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const param = JSON.stringify({
  type: "transaction",
  symbols: [route.params.coinName],
});

const btcChartData = ref<{ data: { x: string; y: number[] }[] }[]>([
  { data: [] },
]);

const onOpen = () => {
  socket.value.send(param);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data) as CoinTickerData;
  console.log(data);
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
