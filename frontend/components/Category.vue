<script setup lang="ts">
import type { Category } from "./Header.vue";

defineProps({
  productTypes: { type: Array<Category> },
});
</script>
<template>
  <div class="absolute bg-white z-10 border w-full top-14 category hidden">
    <div v-for="category in productTypes" class="border p-4 relative self">
      <p class="font-bold">
        {{ category.name }}
      </p>
      <SubCategory
        v-if="category.productTypes"
        :product-types="category.productTypes"
      />
    </div>
  </div>
</template>

<style scoped>
.self:hover > div {
  display: block;
}
</style>
