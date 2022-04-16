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

const chartData = ref<ChartData[]>([
  {
    x: 1491004800000,
    o: 50169000,
    h: 50171000,
    l: 49981000,
    c: 50035000,
  },
  {
    x: 1491177600000,
    o: 50152000,
    h: 50171000,
    l: 49981000,
    c: 50040000,
  },
  {
    x: 1491264000000,
    o: 50152000,
    h: 50171000,
    l: 49981000,
    c: 50040000,
  },
  {
    x: 1491350400000,
    o: 50156000,
    h: 50171000,
    l: 49981000,
    c: 50040000,
  },
  {
    x: 1491436800000,
    o: 50156000,
    h: 50171000,
    l: 49981000,
    c: 50040000,
  },
  {
    x: 1491523200000,
    o: 50152000,
    h: 50171000,
    l: 49981000,
    c: 50040000,
  },
]);

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
