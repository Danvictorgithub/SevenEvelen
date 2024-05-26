<script setup lang="ts">
defineProps({
  productTypes: { type: Array<CategoryType> },
});
</script>
<template>
  <div
    class="absolute bg-white z-10 border w-full left-[calc(100%+0px)] -top-[2px] hidden"
  >
    <div v-for="category in productTypes" class="border p-4 relative">
      <p>
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
