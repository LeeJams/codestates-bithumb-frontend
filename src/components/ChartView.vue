<template>
  <section style="width: 1000px">
    <canvas id="myChart" width="1000" height="250"></canvas>
  </section>
</template>
<script setup lang="ts">
import { nextTick, ref, onMounted, type PropType, watch } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-luxon";
import type { CoinContent, ChartData } from "@/types/dataType";
import { Chart } from "chart.js";

const props = defineProps({
  coinData: {
    type: Object as PropType<CoinContent>,
  },
});

const chartData = ref<ChartData[]>([]);

onMounted(() => {
  Chart.register(CandlestickController, CandlestickElement);
});

nextTick(() => {
  const canvas = document.getElementById("myChart") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const myChart = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          label: "CHRT - Chart.js Corporation",
          data: chartData.value,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
});
</script>
