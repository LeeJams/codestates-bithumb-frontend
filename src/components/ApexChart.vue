<template>
  <apexchart
    type="candlestick"
    height="350"
    :options="options"
    :series="series"
  ></apexchart>
</template>
<script setup lang="ts">
import type {
  CandleStickChartData,
  ConvertedTickerData,
} from "@/types/dataType";
import http from "@/utils/http";
import { onMounted, ref, watchEffect } from "vue";
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

const test = () => {
  watchEffect(() => {
    if (props.tickerData?.openPrice) {
      series.value[0].data[series.value[0].data.length - 1] = {
        x: new Date(),
        y: [
          props.tickerData.openPrice,
          props.tickerData.highPrice,
          props.tickerData.lowPrice,
          props.tickerData.closePrice,
        ],
      };
    }
  });
};
const setChartData = async () => {
  const result: CandleStickChartData = await http.get(
    `/candlestick/${route.params.symbol}_KRW/24h`
  );
  series.value[0].data = result.data
    .map((n) => ({
      x: new Date(n[0]),
      y: [n[1], n[3], n[4], n[2]],
    }))
    .slice(-30);

  test();
};

onMounted(() => {
  setChartData();
});
</script>
