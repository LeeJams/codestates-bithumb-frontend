<template>
  <div>
    <div
      class="row justify-evenly"
      :class="chgAmt > 0 ? 'redColor' : 'blueColor'"
    >
      <p>
        <b>시 </b>
        <span>{{ numberFormat(chartData[chartData.length - 1]?.o) }}</span
        >원
      </p>
      <p>
        <b>고 </b>
        <span>{{ numberFormat(chartData[chartData.length - 1]?.h) }}</span
        >원
      </p>
      <p>
        <b>저 </b>
        <span>{{ numberFormat(chartData[chartData.length - 1]?.l) }}</span
        >원
      </p>
      <p>
        <b>종 </b>
        <span>{{ numberFormat(chartData[chartData.length - 1]?.c) }}</span
        >원
      </p>
      <p>
        <b>변동률 ({{ chartTime }}) </b>
        <span>{{ numberFormat(chgAmt?.toString()) }}</span
        >원 <span>({{ numberFormat(chgRate?.toString()) }}%)</span>
      </p>
    </div>
  </div>
  <section class="row justify-center">
    <canvas id="myChart" width="1000" height="250"></canvas>
  </section>
  <q-select
    v-model="chartTime"
    @update:model-value="changeChartTime"
    :options="['1m', '3m', '5m', '10m', '30m', '1h', '6h', '12h', '24h']"
    label="시간"
    dark
    outlined
    style="max-width: 100px"
    class="q-mt-sm"
  />
</template>
<script setup lang="ts">
import { numberFormat } from "@/utils/common";
import { ref, onMounted, computed } from "vue";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-luxon";
import type {
  ChartData,
  CandleStickChartData,
  ConvertedTickerData,
} from "@/types/dataType";
import { Chart, registerables } from "chart.js";
import http from "@/utils/http";
import { useRoute } from "vue-router";
import zoomPlugin from "chartjs-plugin-zoom";
import type { PropType } from "vue-demi";

const route = useRoute();
const props = defineProps({
  tickerData: {
    type: Object as PropType<ConvertedTickerData>,
    default: () => ({}),
  },
});

const chgAmt = computed(
  () =>
    Number(chartData.value[chartData.value.length - 1]?.c) -
    Number(chartData.value[chartData.value.length - 2]?.c)
);
const chgRate = computed(
  () =>
    ((Number(chartData.value[chartData.value.length - 1]?.c) -
      Number(chartData.value[chartData.value.length - 2]?.c)) /
      Number(chartData.value[chartData.value.length - 2]?.c)) *
    100
);
const chartTime = ref("1m");
const chartData = ref<ChartData[]>([]);

const changeChartTime = () => {
  myChart.value.destroy();
  setChartData();
};

const setChartData = async () => {
  const result: CandleStickChartData = await http.get(
    `/candlestick/${route.params.symbol}_KRW/${chartTime.value}`
  );

  chartData.value = result.data.slice(-300).map((n) => ({
    x: n[0],
    o: n[1],
    h: n[3],
    l: n[4],
    c: n[2],
  }));

  drewChart();
};

onMounted(() => {
  Chart.register(
    CandlestickController,
    CandlestickElement,
    zoomPlugin,
    ...registerables
  );

  setChartData();
});

const myChart = ref();
const canvas = ref();
const ctx = ref();

const drewChart = () => {
  canvas.value = document.getElementById("myChart") as HTMLCanvasElement;
  ctx.value = canvas.value.getContext("2d") as CanvasRenderingContext2D;
  myChart.value = new Chart(ctx.value, {
    type: "candlestick",
    data: {
      datasets: [
        {
          // borderColor: "#18181b",
          data: chartData.value,
        },
      ],
    },
    options: {
      scales: {
        y2: {
          position: "right",
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          cornerRadius: 0,
          caretSize: 0,
          padding: 10,
          backgroundColor: "black",
          borderColor: "gray",
          borderWidth: 2,
          titleMarginBottom: 4,
          titleFont: {
            weight: "bold",
            size: 20,
          },
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
        },
      },
    },
  });
};
</script>
