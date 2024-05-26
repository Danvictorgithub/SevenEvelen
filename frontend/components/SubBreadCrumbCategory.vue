<script setup lang="ts">
const props = defineProps({
  category: {
    type: Object as PropType<BreadCrumbCategoryType>,
  },
});
const breadUrl = `/products?take=10&productTypeId=${props.category!.id}`;
</script>
<template>
  <NuxtLink :to="breadUrl" class="font-medium">
    {{ category!.name }}
  </NuxtLink>
  <Icon
    name="icon-park-outline:right"
    class="font-bold"
    v-if="category!.productTypeParentId"
  />
  <SubBreadCrumbCategory
    :category="category!.productTypes"
    v-if="category!.productTypeParentId"
  />
</template>
