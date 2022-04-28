<template>
  <q-card dark class="my-card q-pa-md" style="width: 350px; height: 100%">
    <q-card-section>
      <div
        class="text-h4 row items-center"
        :class="tickerData?.chgAmt >= 0 ? 'redColor' : 'blueColor'"
      >
        <span>{{ numberFormat(tickerData?.openPrice) }}</span>
        <q-badge
          :color="tickerData?.chgAmt >= 0 ? 'red-5' : 'primary'"
          class="q-ml-sm"
          >{{ tickerData?.chgAmt >= 0 ? "+" : ""
          }}{{ numberFormat(tickerData?.chgRate) }} %</q-badge
        >
      </div>
      <div class="q-mt-sm">
        <div class="text-subtitle2 row">
          <span class="subtitle col-4">거래량(24H)</span>
          <span>{{ numberFormat(tickerData?.volume) }}{{ symbol }}</span>
        </div>
        <div class="text-subtitle2 row">
          <span class="subtitle col-4">고가(당일)</span>
          <span>{{ numberFormat(tickerData?.highPrice) }}</span>
        </div>
        <div class="text-subtitle2 row">
          <span class="subtitle col-4">저가(당일)</span>
          <span>{{ numberFormat(tickerData?.lowPrice) }}</span>
        </div>
        <div class="text-subtitle2 row">
          <span class="subtitle col-4">전일종가</span>
          <span>{{ numberFormat(tickerData?.closePrice) }}</span>
        </div>
      </div>
    </q-card-section>

    <q-separator dark inset />

    <q-card-section>
      <LineChart :chartData="chartData" :options="options" />
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import type {
  CandleStickChartData,
  ConvertedTickerData,
} from "@/types/dataType";
import { numberFormat } from "@/utils/common";
import { onMounted, computed, ref, type PropType } from "vue-demi";
import { LineChart } from "vue-chart-3";
import { useRoute } from "vue-router";
import http from "@/utils/http";
import type { ChartData } from "chart.js";

const props = defineProps({
  tickerData: {
    type: Object as PropType<ConvertedTickerData>,
    default: () => ({}),
  },
});

const route = useRoute();
const symbol = computed(() => route.params.symbol as string);
const chartData = ref<ChartData<"line">>({
  labels: [],
  datasets: [
    {
      label: "Price",
      backgroundColor: "#b6d4f1",
      fill: true,
      borderColor: "#619cf2",
      borderWidth: 1,
      data: [],
    },
  ],
});
const options = ref({
  responsive: true,
  scales: {
    y2: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
});
const setChartData = async () => {
  const result: CandleStickChartData = await http.get(
    `/candlestick/${route.params.symbol}_KRW/1m`
  );
  chartData.value.labels = result.data
    .slice(-50)
    .map(
      (n) =>
        `${new Date(n[0]).getHours()}:${new Date(n[0])
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
    );
  chartData.value.datasets[0].data = result.data
    .slice(-50)
    .map((n) => parseInt(n[1]));
};
const startInterval = () => {
  setInterval(() => setChartData(), 60000);
};

onMounted(() => {
  setChartData();
  startInterval();
});
</script>
