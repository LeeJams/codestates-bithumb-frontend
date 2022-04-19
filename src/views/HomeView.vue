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
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" style="cursor: pointer">
            <q-td auto-width>
              <q-checkbox
                v-model="selected"
                checked-icon="star"
                unchecked-icon="star_border"
                color="yellow"
                :val="props.row.engName"
              />
            </q-td>
            <q-td key="name" :props="props" @click="moveDetailPage(props.row)">
              <img
                :src="`src/assets/images/coin-icon/${props.row.engName}.png`"
                alt=""
                style="width: 1rem; height: 1rem; margin-right: 2px"
              />
              {{ props.row.name }}<br /><span class="coinEngName"
                >{{ props.row.engName }}/KRW</span
              >
            </q-td>
            <q-td
              key="openPrice"
              :props="props"
              @click="moveDetailPage(props.row)"
            >
              {{ props.row.openPrice }}원
            </q-td>
            <q-td
              key="chgRate"
              :props="props"
              :class="props.row.up > 0 ? 'redColor' : 'blueColor'"
              @click="moveDetailPage(props.row)"
            >
              <span>{{ props.row.chgPrice }}원 ({{ props.row.chgRate }}%)</span>
            </q-td>
            <q-td
              key="volume"
              :props="props"
              @click="moveDetailPage(props.row)"
            >
              {{ props.row.volume }}원
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { RowItem, TickerContent } from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
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
    sort: (a: string, b: string) =>
      parseInt(a.split(",").join(""), 10) - parseInt(b.split(",").join(""), 10),
  },
  {
    name: "chgRate",
    align: "right",
    label: "전일대비",
    field: "chgRate",
    sortable: true,
    sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "volume",
    align: "right",
    label: "거래금액(24H)",
    field: "volume",
    sortable: true,
    sort: (a: string, b: string) =>
      parseInt(a.split(",").join(""), 10) - parseInt(b.split(",").join(""), 10),
  },
];

const rows = ref<RowItem[]>([]);
const selected = ref([]);

const moveDetailPage = (row: RowItem) => {
  router.push({
    name: "CoinInfo",
    params: { symbol: row.engName },
  });
};

const getAllCoinData = async (): Promise<Array<string>> => {
  const result = await http.get("/ticker/ALL_KRW");
  const keys = Object.keys(result.data);
  const tickTypes = [];
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "date") {
      tickTypes.push(`${keys[i]}_KRW`);
      const data = result.data[keys[i]];
      rows.value[i] = {
        name: COIN_NAME[keys[i]] || "-",
        engName: keys[i],
        openPrice: numberFormat(data.opening_price),
        chgRate: data.fluctate_rate_24H,
        chgPrice: numberFormat(data.fluctate_24H),
        volume: numberFormat(
          `${Math.round(parseInt(data.acc_trade_value_24H))}`
        ),
        up: Number(data.fluctate_rate_24H),
      };
    }
  }

  return tickTypes;
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data.type === "ticker") {
    const { symbol, chgAmt, value, chgRate, openPrice } =
      data.content as TickerContent;
    const idx = rows.value.findIndex(
      (n) => n.engName === symbol.substring(0, 3)
    );
    if (idx !== -1) {
      rows.value[idx].chgPrice = numberFormat(chgAmt);
      rows.value[idx].chgRate = chgRate;
      rows.value[idx].openPrice = numberFormat(openPrice);
      rows.value[idx].volume = numberFormat(`${Math.round(parseInt(value))}`);
      rows.value[idx].up = Number(data.content.chgRate);
    }
  }
};

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const connectSocket = (ticker: string) => {
  socket.value = new WebSocket("wss://pubwss.bithumb.com/pub/ws");
  socket.value.onopen = function () {
    socket.value.send(ticker);
  };
  socket.value.onmessage = function (event: MessageEvent) {
    onMessage(event);
  };
  socket.value.onclose = function () {
    socket.value.close();
  };
};

onMounted(async () => {
  const types = await getAllCoinData();
  const ticker = JSON.stringify({
    type: "ticker",
    symbols: types,
    tickTypes: ["24H"],
  });
  connectSocket(ticker);
});
onBeforeUnmount(() => {
  socket.value.close();
});
</script>
