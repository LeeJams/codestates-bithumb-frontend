<template>
  <apexchart
    type="candlestick"
    height="350"
    :options="options"
    :series="series"
  ></apexchart>
  <q-select
    v-model="chartTime"
    @update:model-value="changeChart"
    :options="['1m', '3m', '5m', '10m', '30m', '1h', '6h', '12h', '24h']"
    dark
    outlined
    class="q-ml-md"
    style="max-width: 100px"
  />
</template>
<script setup lang="ts">
import type {
  CandleStickChartData,
  ConvertedTickerData,
} from "@/types/dataType";
import http from "@/utils/http";
import { onMounted, ref, onBeforeUnmount } from "vue";
import type { PropType } from "vue-demi";
import { useRoute } from "vue-router";
const props = defineProps({
  tickerData: {
    type: Object as PropType<ConvertedTickerData>,
    default: () => ({}),
  },
});
const route = useRoute();
const options = {
  chart: {
    type: "candlestick",
    height: 500,
    animations: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
  },
  title: {
    text: "CandleStick Chart",
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: "#f75467",
        downward: "#4386f9",
      },
    },
  },
  noData: {
    text: "Loading...",
  },
  tooltip: {
    theme: "dark",
  },
};
const series = ref<{ data: { x: Date; y: Array<string> }[] }[]>([
  {
    data: [],
  },
]);

const chartTime = ref("1m");
const intervalFn = ref();

const changeChart = () => {
  if (intervalFn.value) {
    clearInterval(intervalFn.value);
  }
  setChartData();
  intervalFn.value = setInterval(() => setChartData(), 5000);
};

const setChartData = async () => {
  const result: CandleStickChartData = await http.get(
    `/candlestick/${route.params.symbol}_KRW/${chartTime.value}`
  );
  series.value[0].data = result.data
    .map((n) => ({
      x: new Date(n[0]),
      y: [n[1], n[3], n[4], n[2]],
    }))
    .slice(-50);
};

onMounted(() => {
  setChartData();
  intervalFn.value = setInterval(() => setChartData(), 5000);
});
onBeforeUnmount(() => {
  if (intervalFn.value) {
    clearInterval(intervalFn.value);
  }
});
</script>
