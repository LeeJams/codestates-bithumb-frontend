<template>
  <div class="container">
    <div class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        dark
        hide-bottom
        class="q-pa-lg"
        :filter="filter"
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
                :src="`src/assets/images/${props.row.name}.png`"
                alt=""
                style="width: 1rem; height: 1rem; margin-right: 2px"
              />
              {{ props.row.name }}
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
import type { TickerContent, CoinTickerData, RowItem } from "@/types/dataType";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { numberFormat } from "@/utils/common";
import { useRouter } from "vue-router";
import http from "@/utils/http";
const router = useRouter();
const filter = ref("");
const columns = [
  {
    name: "name",
    align: "center",
    label: "이름",
    field: "name",
  },
  {
    name: "openPrice",
    align: "right",
    label: "현재가",
    field: "openPrice",
  },
  {
    name: "chgRate",
    align: "right",
    label: "전일대비",
    field: "chgRate",
  },
  {
    name: "volume",
    align: "right",
    label: "거래금액(24H)",
    field: "volume",
  },
];

const rows = ref<RowItem[]>([
  {
    name: "비트코인_(BTC)",
    openPrice: "",
    chgRate: "",
    volume: "",
    up: 0,
    symbol: "BTC_KRW",
  },
  {
    name: "이더리움_(ETH)",
    openPrice: "",
    chgRate: "",
    volume: "",
    up: 0,
    symbol: "ETH_KRW",
  },
]);

const setRow = (idx: number, name: string, data: TickerContent) => {
  rows.value[idx] = {
    name: name,
    openPrice: `${numberFormat(data.openPrice)}원`,
    chgRate: `${numberFormat(data.chgAmt)}원 (${data.chgRate}%)`,
    volume: `${numberFormat(data.volume)}원`,
    up: Number(data.chgAmt),
    symbol: data.symbol,
  };
};

const moveDetailPage = (row: RowItem) => {
  router.push({
    name: "CoinInfo",
    params: { symbol: row.symbol, name: row.name },
  });
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data) as CoinTickerData;
  if (data?.content) {
    if (data?.content.symbol === "BTC_KRW") {
      setRow(0, "비트코인_(BTC)", data.content);
    }
    if (data?.content.symbol === "ETH_KRW") {
      setRow(1, "이더리움_(ETH)", data.content);
    }
  }
};

const socket = ref<WebSocket>(new WebSocket("wss://pubwss.bithumb.com/pub/ws"));
const param = JSON.stringify({
  type: "ticker",
  symbols: ["BTC_KRW", "ETH_KRW"],
  tickTypes: ["24H"],
});

const onOpen = () => {
  socket.value.send(param);
};

const getAllCoinData = async () => {
  const result = await http.get("/ticker/ALL_KRW");
  console.log(result);
};

onMounted(() => {
  socket.value.onopen = function () {
    onOpen();
  };

  socket.value.onmessage = function (event: MessageEvent) {
    onMessage(event);
  };

  getAllCoinData();
});
onBeforeUnmount(() => {
  socket.value.close();
});
</script>
