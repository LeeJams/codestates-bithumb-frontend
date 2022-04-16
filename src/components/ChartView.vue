<template>
  <section class="row justify-center">
    <canvas id="myChart" width="1000" height="250"></canvas>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, type PropType } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-luxon";
import type {
  TickerContent,
  ChartData,
  CandleStickChartData,
} from "@/types/dataType";
import { Chart } from "chart.js";
import http from "@/utils/http";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  coinData: {
    type: Object as PropType<TickerContent>,
  },
});

const chartData = ref<ChartData[]>([]);

const setChartData = async () => {
  const result: CandleStickChartData = await http.get(
    `/candlestick/${route.params.symbol}/10m`
  );
  console.log(typeof result.data);
  chartData.value = result.data.map((n) => ({
    x: n[0],
    o: n[1],
    h: n[2],
    l: n[3],
    c: n[4],
  }));
  dreaChart();
};

onMounted(() => {
  Chart.register(CandlestickController, CandlestickElement);
  setChartData();
});

const dreaChart = () => {
  const canvas = document.getElementById("myChart") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const myChart = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          borderColor: "#3a9339",
          data: chartData.value,
        },
      ],
    },
    options: {
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
      },
    },
  });
};
</script>
