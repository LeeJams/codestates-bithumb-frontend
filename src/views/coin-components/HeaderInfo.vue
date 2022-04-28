<template>
  <header>
    <h5>
      {{ COIN_NAME[symbol] }}
    </h5>
    <div class="row justify-evenly" :class="isUp ? 'redColor' : 'blueColor'">
      <p>
        <b>시</b> <span>{{ numberFormat(tickerData?.openPrice) }}</span
        >원
      </p>
      <p>
        <b>고</b> <span>{{ numberFormat(tickerData?.highPrice) }}</span
        >원
      </p>
      <p>
        <b>저</b> <span>{{ numberFormat(tickerData?.lowPrice) }}</span
        >원
      </p>
      <p>
        <b>종</b> <span>{{ numberFormat(tickerData?.closePrice) }}</span
        >원
      </p>
      <p>
        <b>전일대비 </b>
        <span>{{ numberFormat(tickerData?.chgAmt) }}</span
        >원 <span>({{ tickerData?.chgRate }}%)</span>
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ConvertedTickerData } from "@/types/dataType";
import { numberFormat, COIN_NAME } from "@/utils/common";
import { computed } from "vue";
import type { PropType } from "vue-demi";
import { useRoute } from "vue-router";

const props = defineProps({
  tickerData: {
    type: Object as PropType<ConvertedTickerData>,
    default: () => ({}),
  },
});
const symbol = computed(() => route.params.symbol as string);
const route = useRoute();
const isUp = computed(() => Number(props.tickerData.chgRate) > 0);
</script>
