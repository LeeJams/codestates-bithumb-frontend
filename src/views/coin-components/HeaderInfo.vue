<template>
  <header>
    <h4>비트코인 {{ route.params.coinName }}</h4>
    <div class="coin_header" :class="isUp ? 'redColor' : 'blueColor'">
      <p>
        <b>시</b> <span>{{ numberFormat(coinData?.openPrice) }}</span>
      </p>
      <p>
        <b>고</b> <span>{{ numberFormat(coinData?.highPrice) }}</span>
      </p>
      <p>
        <b>저</b> <span>{{ numberFormat(coinData?.lowPrice) }}</span>
      </p>
      <p>
        <b>종</b> <span>{{ numberFormat(coinData?.closePrice) }}</span>
      </p>
      <p>
        <b>전일대비 </b>
        <span
          >{{ coinData?.chgRate }}% ({{ numberFormat(coinData?.chgAmt) }})</span
        >
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { CoinContent } from "@/types/dataType";
import { numberFormat } from "@/utils/common";
import { computed, type PropType } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  coinData: {
    type: Object as PropType<CoinContent>,
    default: () => ({}),
  },
});
const route = useRoute();
const isUp = computed(() => Number(props.coinData.chgRate) > 0);
</script>
