<template>
  <section>
    <vue3-chart-js v-bind="{ ...barChart }" />
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

const props = defineProps({
  series: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "",
  },
});

const options = {
  chart: {
    type: "candlestick",
    height: 500,
  },
  title: {
    text: props.title,
    align: "left",
  },
};

const barChart = {
  type: "bar",
  options: {
    min: 0,
    max: 100,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        min: -100,
        max: 100,
        ticks: {
          callback: function (val: any) {
            return `${val}%`;
          },
        },
      },
    },
  },
  data: {
    labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
    datasets: [
      {
        label: "My First Dataset",
        backgroundColor: ["#1abc9c", "#f1c40f", "#2980b9", "#34495e"],
        data: [40, 20, 50, 10],
      },
      {
        label: "My Second Dataset",
        backgroundColor: ["#2ecc71", "#e67e22", "#9b59b6", "#bdc3c7"],
        data: [-40, -20, -10, -10],
      },
    ],
  },
};
</script>
