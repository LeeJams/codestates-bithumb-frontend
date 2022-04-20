<template>
  <div class="">
    <p>모아보기</p>
    <div class="item">
      <BarChart :chartData="chartData" :options="options" />
      <table border="">
        <thead>
          <th>판매 수량({{ route.params.symbol }})</th>
          <th>가격(KRW)</th>
          <th>구매 수량({{ route.params.symbol }})</th>
        </thead>
        <tbody>
          <tr v-for="(data, idx) in askList" :key="idx">
            <td style="color: blue; text-align: right">{{ data[1] }}</td>
            <td style="text-align: center">{{ numberFormat(data[0]) }}</td>
            <td></td>
          </tr>
          <tr v-for="(data, idx) in bidList" :key="idx">
            <td></td>
            <td style="text-align: center">{{ numberFormat(data[0]) }}</td>
            <td style="color: red; text-align: right">{{ data[1] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { numberFormat } from "@/utils/common";
import type { PropType } from "vue-demi";
import { Chart, registerables } from "chart.js";
import { BarChart } from "vue-chart-3";
import { computed, ref } from "vue";

Chart.register(...registerables);
const route = useRoute();

const props = defineProps({
  askList: {
    type: Array as PropType<[string, number][]>,
    default: () => [],
  },
  bidList: {
    type: Array as PropType<[string, number][]>,
    default: () => [],
  },
});

const chartData = computed(() => ({
  labels: [
    ...props.bidList.map((n) => n[0]),
    ...props.askList.map((n) => n[0]),
  ].sort(),

  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      barThickness: 10,
      data: [
        ...props.bidList.map((n) => n[1]),
        ...props.askList.map((n) => n[1]),
      ].sort(),
    },
  ],
}));
const options = ref({
  responsive: true,
  indexAxis: "y",
  scales: {
    x2: {
      display: false,
    },
    y2: {
      // display: false,
      // position: "right",
      reverse: true,
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
      enabled: false,
    },
  },
});
</script>
