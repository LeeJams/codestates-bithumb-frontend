<template>
  <LineChart v-bind="lineChartProps" />
</template>
<script setup lang="ts">
import { computed, type PropType } from "vue";
import { LineChart, useLineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps({
  btcChartData: {
    type: Array as PropType<{ time: string; price: number }[]>,
    default: () => [],
  },
  ethChartData: {
    type: Array as PropType<{ time: string; price: number }[]>,
    default: () => [],
  },
});

Chart.register(...registerables);

const btcPrices = computed(() => props.btcChartData.map((n) => n.price));
const ethPrices = computed(() => props.ethChartData.map((n) => n.price));
const labels = computed(() => props.btcChartData.map((n) => n.time));

const testData = computed<ChartData<"line">>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: "비트코인",
      data: btcPrices.value,
      backgroundColor: "#f75467",
      borderColor: "#f75467",
      spanGaps: true,
    },
    {
      label: "이더리움",
      data: ethPrices.value,
      backgroundColor: "#4386f9",
      borderColor: "#4386f9",
      spanGaps: true,
    },
  ],
}));

const options = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  fill: false,
  interaction: {
    intersect: false,
  },
  radius: 0,
}));

const { lineChartProps } = useLineChart({
  chartData: testData,
  options,
});
</script>
