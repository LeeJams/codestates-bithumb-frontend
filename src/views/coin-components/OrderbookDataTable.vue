<template>
  <q-table
    class="q-pa-lg q-mt-xl"
    title="모아보기"
    :rows="rowData"
    :columns="columns"
    row-key="price"
    dark
    hide-bottom
    :pagination="pagination"
    dense
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="ask" :props="props" class="blueColor">
          <span v-if="props.row.type === 'ask'">{{
            numberFormat(props.row.qty)
          }}</span>
        </q-td>
        <q-td key="price" :props="props">
          {{ numberFormat(props.row.price) }}
        </q-td>
        <q-td key="bid" :props="props" class="redColor">
          <span v-if="props.row.type === 'bid'">{{
            numberFormat(props.row.qty)
          }}</span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
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
const pagination = ref({ rowsPerPage: 0 });
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

const rowData = computed(() => [
  ...props.askList
    .map((n) => ({ price: n[0], qty: n[1], type: "ask" }))
    .sort(
      (
        a: { price: string; qty: number; type: string },
        b: { price: string; qty: number; type: string }
      ) => parseFloat(b.price) - parseFloat(a.price)
    ),
  ...props.bidList
    .map((n) => ({ price: n[0], qty: n[1], type: "bid" }))
    .sort(
      (
        a: { price: string; qty: number; type: string },
        b: { price: string; qty: number; type: string }
      ) => parseFloat(b.price) - parseFloat(a.price)
    ),
]);

const columns = [
  {
    name: "ask",
    align: "right",
    label: `판매 수량(${route.params.symbol})`,
    field: "ask",
  },
  {
    name: "price",
    align: "center",
    label: "현재가",
    field: "price",
  },
  {
    name: "bid",
    align: "right",
    label: `구매 수량(${route.params.symbol})`,
    field: "bid",
  },
];

const chartData = computed(() => ({
  labels: rowData.value.map((n) => n.price),

  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      barThickness: 10,
      data: rowData.value.map((n) => n.qty),
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
