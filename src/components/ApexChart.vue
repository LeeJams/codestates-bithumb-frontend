<template>
  <div>
    <div
      class="row justify-evenly"
      :class="chgAmt > 0 ? 'redColor' : 'blueColor'"
    >
      <p>
        <b>시 </b>
        <span>{{ numberFormat(priceData[0]) }}</span
        >원
      </p>
      <p>
        <b>고 </b>
        <span>{{ numberFormat(priceData[1]) }}</span
        >원
      </p>
      <p>
        <b>저 </b>
        <span>{{ numberFormat(priceData[2]) }}</span
        >원
      </p>
      <p>
        <b>종 </b>
        <span>{{ numberFormat(priceData[3]) }}</span
        >원
      </p>
      <p>
        <b>변동률 ({{ chartTime }}) </b>
        <span>{{ numberFormat(chgAmt?.toString()) }}</span
        >원 <span>({{ numberFormat(chgRate?.toString()) }}%)</span>
      </p>
    </div>
  </div>
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
import { onMounted, ref, onBeforeUnmount, computed } from "vue";
import type { PropType } from "vue-demi";
import { useRoute } from "vue-router";
import { numberFormat } from "@/utils/common";
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
const priceData = computed(() => {
  if (series.value[0]?.data[49]?.y) {
    return series.value[0]?.data[49]?.y;
  }
  return ["0", "0", "0", "0"];
});
const chgAmt = computed(
  () =>
    Number(series.value[0]?.data[49]?.y[3]) -
    Number(series.value[0]?.data[48]?.y[3])
);
const chgRate = computed(
  () =>
    ((Number(series.value[0]?.data[49]?.y[3]) -
      Number(series.value[0]?.data[48]?.y[3])) /
      Number(series.value[0]?.data[48]?.y[3])) *
    100
);

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
