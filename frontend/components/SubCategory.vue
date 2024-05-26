<script setup lang="ts">
defineProps({
  productTypes: { type: Array<CategoryType> },
});
function categoryLink(id: number) {
  return `/products?productTypeId=${id}&take=10`;
}
</script>
<template>
  <div
    class="absolute bg-white z-10 border w-full left-[calc(100%+0px)] -top-[2px] hidden"
  >
    <p v-for="category in productTypes" class="border relative">
      <NuxtLink :to="categoryLink(category.id)">
        <p class="h-full w-full p-4 hover:bg-green-400 hover:text-white">
          {{ category.name }}
        </p>
      </NuxtLink>
      <SubCategory
        v-if="category.productTypes"
        :product-types="category.productTypes"
      />
    </p>
  </div>
</template>
<style scoped>
.self:hover > div {
  display: block;
}
</style>
