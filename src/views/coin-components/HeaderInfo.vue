<template>
  <header>
    <h5>
      {{ COIN_NAME[route.params.symbol] }}
    </h5>
    <div class="row justify-evenly" :class="isUp ? 'redColor' : 'blueColor'">
      <p>
        <b>시</b> <span>{{ numberFormat(coinData?.openPrice) }}</span
        >원
      </p>
      <p>
        <b>고</b> <span>{{ numberFormat(coinData?.highPrice) }}</span
        >원
      </p>
      <p>
        <b>저</b> <span>{{ numberFormat(coinData?.lowPrice) }}</span
        >원
      </p>
      <p>
        <b>종</b> <span>{{ numberFormat(coinData?.closePrice) }}</span
        >원
      </p>
      <p>
        <b>전일대비 </b>
        <span>{{ numberFormat(coinData?.chgAmt) }}</span
        >원 <span>({{ coinData?.chgRate }}%)</span>
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { CoinHeaderData } from "@/types/dataType";
import { numberFormat, COIN_NAME } from "@/utils/common";
import { computed, type PropType } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  coinData: {
    type: Object as PropType<CoinHeaderData>,
    default: () => ({}),
  },
});

const route = useRoute();
const isUp = computed(() => Number(props.coinData.chgRate) > 0);
</script>
