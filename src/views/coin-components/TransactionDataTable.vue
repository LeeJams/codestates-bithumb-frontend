<template>
  <q-table
    class="q-pa-lg q-mt-xl"
    title="체결내역"
    :rows="transactionData"
    :columns="columns"
    row-key="time"
    dark
    hide-bottom
    :pagination="pagination"
    dense
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="time" :props="props">
          {{ props.row.time }}
        </q-td>
        <q-td key="price" :props="props">
          {{ props.row.price }}
        </q-td>
        <q-td
          key="qty"
          :props="props"
          :class="props.row.updn === 'up' ? 'redColor' : 'blueColor'"
        >
          <span>{{ props.row.qty }}</span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableProps } from "quasar";
import { ref } from "vue";
import type { PropType } from "vue-demi";

const props = defineProps({
  transactionData: {
    type: Array as PropType<
      { time: string; price: string; qty: string; updn: string }[]
    >,
    default: () => [],
  },
});

const pagination = ref({ rowsPerPage: 0 });
const columns: QTableProps["columns"] = [
  {
    name: "time",
    align: "center",
    label: "시간",
    field: "time",
  },
  {
    name: "price",
    align: "right",
    label: "현재가",
    field: "price",
  },
  {
    name: "qty",
    align: "right",
    label: "수량",
    field: "qty",
  },
];
</script>
<style scoped>
.q-table--dense .q-table th,
.q-table--dense .q-table td {
  width: 200px;
}
</style>
