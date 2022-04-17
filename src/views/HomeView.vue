<template>
  <div class="container">
    <div class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        dark
        hide-bottom
        class="q-pa-lg col-5 my-sticky-header-table"
        :filter="filter"
        :pagination="pagination"
        style="height: 100%"
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="코인 검색"
            dark
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr
            :props="props"
            style="cursor: pointer"
            @click="moveDetailPage(props.row)"
          >
            <q-td key="name" :props="props">
              <img
                :src="`src/assets/images/coin-icon/${props.row.engName}.png`"
                alt=""
                style="width: 1rem; height: 1rem; margin-right: 2px"
              />
              {{ props.row.name }}<br /><span class="coinEngName"
                >{{ props.row.engName }}/KRW</span
              >
            </q-td>
            <q-td key="openPrice" :props="props">
              {{ props.row.openPrice }}
            </q-td>
            <q-td
              key="chgRate"
              :props="props"
              :class="props.row.up > 0 ? 'redColor' : 'blueColor'"
            >
              <span>{{ props.row.chgRate }}</span>
            </q-td>
            <q-td key="volume" :props="props">
              {{ props.row.volume }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { RowItem } from "@/types/dataType";
import { onMounted, ref } from "vue";
import { numberFormat, COIN_NAME } from "@/utils/common";
import { useRouter } from "vue-router";
import http from "@/utils/http";
const router = useRouter();
const filter = ref("");
const pagination = ref({ rowsPerPage: 0 });
const columns = [
  {
    name: "name",
    align: "left",
    label: "이름",
    field: "name",
    sortable: true,
  },
  {
    name: "openPrice",
    align: "right",
    label: "현재가",
    field: "openPrice",
    sortable: true,
  },
  {
    name: "chgRate",
    align: "right",
    label: "전일대비",
    field: "chgRate",
    sortable: true,
  },
  {
    name: "volume",
    align: "right",
    label: "거래금액(24H)",
    field: "volume",
    sortable: true,
  },
];

const rows = ref<RowItem[]>([]);

const moveDetailPage = (row: RowItem) => {
  router.push({
    name: "CoinInfo",
    params: { symbol: row.engName },
  });
};

const getAllCoinData = async () => {
  const result = await http.get("/ticker/ALL_KRW");
  const keys = Object.keys(result.data);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "date") {
      console.log(keys[i]);
      const data = result.data[keys[i]];
      rows.value[i] = {
        name: COIN_NAME[keys[i]],
        engName: keys[i],
        openPrice: `${numberFormat(data.opening_price)}원`,
        chgRate: `${numberFormat(data.fluctate_24H)}원 (${
          data.fluctate_rate_24H
        }%)`,
        volume: `${numberFormat(data.acc_trade_value_24H)}원`,
        up: Number(data.fluctate_rate_24H),
      };
    }
  }
};

onMounted(() => {
  getAllCoinData();
});
</script>
