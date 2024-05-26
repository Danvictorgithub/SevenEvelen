<script lang="ts" setup>
defineProps({
  productTypes: { type: Array<CategoryType> },
});
function categoryLink(id: number) {
  return `/products?productTypeId=${id}&take=10`;
}
</script>

<template>
  <div class="" v-for="category in productTypes">
    <NuxtLink :to="categoryLink(category.id)" class="">
      <p class="font-bold p-4 hover:bg-green-400 hover:text-white">
        {{ category.name }}
      </p>
    </NuxtLink>
    <div class="bg-slate-100" v-for="subCategory in category.productTypes">
      <NuxtLink :to="categoryLink(category.id)">
        <p class="hover:bg-green-400 hover:text-white px-8 py-4">
          {{ subCategory.name }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
