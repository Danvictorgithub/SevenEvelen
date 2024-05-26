<script setup lang="ts">
defineProps({
  productTypes: { type: Array<CategoryType> },
});
function categoryLink(id: number) {
  return `/products?productTypeId=${id}&take=10`;
}
</script>
<template>
  <div class="absolute bg-white z-10 border w-full top-14 category hidden">
    <div v-for="category in productTypes" class="border relative self">
      <NuxtLink :to="categoryLink(category.id)" class="h-full w-full">
        <p class="font-bold p-4 hover:bg-green-400 hover:text-white">
          {{ category.name }}
        </p>
      </NuxtLink>
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
