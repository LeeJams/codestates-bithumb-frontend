<template>
  <div id="chart" style="width: 40%">
    <apexchart
      type="candlestick"
      height="350"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

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
</script>
