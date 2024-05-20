<script lang="ts" setup>
import type { Category } from "./Header.vue";

defineProps({
  productTypes: { type: Array<Category> },
});
</script>

<template>
  <div class="" v-for="category in productTypes">
    <p class="font-bold p-4">{{ category.name }}</p>
    <div
      class="bg-slate-100 px-8 py-4"
      v-for="subCategory in category.productTypes"
    >
      <p>{{ subCategory.name }}</p>
    </div>
  </div>
</template>
