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
          <div
            v-if="props.row.type === 'ask'"
            class="orderBookDIvAsk"
            :style="widthValue(props.row.qty)"
          ></div>
        </q-td>
        <q-td key="price" :props="props">
          {{ numberFormat(props.row.price) }}
        </q-td>
        <q-td key="bid" :props="props" class="redColor">
          <span v-if="props.row.type === 'bid'">{{
            numberFormat(props.row.qty)
          }}</span>
          <div
            v-if="props.row.type === 'bid'"
            class="orderBookDIvBid"
            :style="widthValue(props.row.qty)"
          ></div>
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
import { computed, ref } from "vue";
import type { QTableProps } from "quasar";

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

const maxQty = computed(() => Math.max(...rowData.value.map((n) => n.qty)));
const widthValue = (qty: number) => {
  return `width: ${Math.round((qty * 100) / maxQty.value)}%`;
};

const columns: QTableProps["columns"] = [
  {
    name: "ask",
    label: `판매 수량(${route.params.symbol})`,
    field: "ask",
    align: "right",
  },
  {
    name: "price",
    label: "현재가",
    field: "price",
    align: "center",
  },
  {
    name: "bid",
    label: `구매 수량(${route.params.symbol})`,
    field: "bid",
    align: "right",
  },
];
</script>
