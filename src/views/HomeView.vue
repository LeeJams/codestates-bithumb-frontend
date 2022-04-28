<template>
  <div class="container">
    <q-breadcrumbs class="q-mb-md q-ml-md">
      <q-breadcrumbs-el icon="home" label="Home" />
    </q-breadcrumbs>
    <div class="q-pa-md text-white">
      <q-btn-toggle
        v-model="toggleView"
        push
        glossy
        toggle-color="teal"
        :options="[
          { label: '원화마켓', value: true },
          { label: '즐겨찾기', value: false },
        ]"
      />
    </div>
    <div class="q-pa-md">
      <div class="row justify-end q-mb-sm">
        <q-input
          v-model="filter"
          placeholder="코인 검색"
          dark
          dense
          style="max-width: 400px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <q-table
        :rows="toggleView ? allCoinData : favoriteCoins"
        :columns="columns"
        row-key="name"
        dark
        hide-bottom
        class="q-pa-lg col-5 my-sticky-header-table"
        :filter="filter"
        :pagination="pagination"
        style="height: 100%"
      >
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
                @update:model-value="setCookie"
              />
            </q-td>
            <q-td key="name" :props="props" @click="moveDetailPage(props.row)">
              <img
                :src="imageUrl(props.row.engName)"
                alt="coin image"
                class="coinImg"
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
              <span :class="props.row.activeStatus"
                >{{ props.row.openPrice }}원</span
              >
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
import type { CoinTableRowItems, TickerContent } from "@/types/dataType";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { numberFormat, COIN_NAME } from "@/utils/common";
import { useRouter } from "vue-router";
import http from "@/utils/http";
import { useCookies } from "vue3-cookies";
import type { QTableProps } from "quasar";

const router = useRouter();
const toggleView = ref(true);

const filter = ref("");
const pagination = ref({ rowsPerPage: 0 });
const columns: QTableProps["columns"] = [
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

const imageUrl = (name: string) => {
  return new URL(`../assets/images/coin-icon/${name}.png`, import.meta.url)
    .href;
};

const { cookies } = useCookies();
const selected = ref<Array<string>>([]);
const getCookieData = () => {
  const coins = cookies.get("favoriteCoins");
  selected.value = coins?.split(",") || [];
};
const setCookie = () => {
  cookies.set("favoriteCoins", selected.value.join(","));
};
const favoriteCoins = computed(() =>
  allCoinData.value.filter((n) => selected.value.includes(n.engName))
);

const allCoinData = ref<CoinTableRowItems[]>([]);
const getAllCoinData = async (): Promise<Array<string>> => {
  const result = await http.get("/ticker/ALL_KRW");
  const keys = Object.keys(result.data);
  const tickTypes = [];

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "date") {
      tickTypes.push(`${keys[i]}_KRW`);

      const data = result.data[keys[i]];

      allCoinData.value[i] = {
        name: COIN_NAME[keys[i]] || "-",
        engName: keys[i],
        openPrice: numberFormat(data.opening_price),
        chgRate: data.fluctate_rate_24H,
        chgPrice: numberFormat(data.fluctate_24H),
        volume: numberFormat(
          `${Math.round(parseInt(data.acc_trade_value_24H))}`
        ),
        up: Number(data.fluctate_rate_24H),
        activeStatus: "",
      };
    }
  }

  return tickTypes;
};

const setNewCoinData = (
  originalCoinInfo: CoinTableRowItems,
  newCoinInfo: TickerContent
) => {
  originalCoinInfo.chgPrice = numberFormat(newCoinInfo.chgAmt);
  originalCoinInfo.chgRate = newCoinInfo.chgRate;
  originalCoinInfo.openPrice = numberFormat(newCoinInfo.openPrice);
  originalCoinInfo.volume = numberFormat(
    `${Math.round(parseInt(newCoinInfo.value))}`
  );
  originalCoinInfo.up = Number(newCoinInfo.chgRate);
};

const showPriceUpOrDownLine = (
  originalCoinInfo: CoinTableRowItems,
  newCoinInfo: TickerContent
) => {
  if (originalCoinInfo.openPrice < numberFormat(newCoinInfo.openPrice)) {
    originalCoinInfo.activeStatus = "redBorder";
  } else if (originalCoinInfo.openPrice > numberFormat(newCoinInfo.openPrice)) {
    originalCoinInfo.activeStatus = "blueBorder";
  }
  setTimeout(() => {
    originalCoinInfo.activeStatus = "";
  }, 500);
};

const onMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);

  if (data.type === "ticker") {
    const newCoinInfo = data.content as TickerContent;

    const idx = allCoinData.value.findIndex(
      (n) => n.engName === newCoinInfo.symbol.substring(0, 3)
    );

    if (idx !== -1) {
      showPriceUpOrDownLine(allCoinData.value[idx], newCoinInfo);
      setNewCoinData(allCoinData.value[idx], newCoinInfo);
    }
  }
};

const socket = ref();

const connectSocket = (ticker: string) => {
  socket.value = new WebSocket("wss://pubwss.bithumb.com/pub/ws");
  socket.value.onopen = function () {
    socket.value.send(ticker);
  };
  socket.value.onmessage = function (event: MessageEvent) {
    onMessage(event);
  };
};

const moveDetailPage = (row: CoinTableRowItems) => {
  router.push({
    name: "CoinInfo",
    params: { symbol: row.engName },
  });
};

onMounted(async () => {
  try {
    const types = await getAllCoinData();
    const ticker = JSON.stringify({
      type: "ticker",
      symbols: types,
      tickTypes: ["24H"],
    });
    connectSocket(ticker);
    getCookieData();
  } catch (e) {
    console.log(e);
    alert(
      "코인 정보를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요"
    );
  }
});

onBeforeUnmount(() => {
  socket.value.close();
});
</script>
