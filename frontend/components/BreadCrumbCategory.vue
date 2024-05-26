<script setup lang="ts">
const props = defineProps({
  category: {
    type: Object as PropType<BreadCrumbCategoryType>,
  },
});
const query = useRoute().query;
const link = useRoute().path;
const url = new URLSearchParams();
Object.keys(query).forEach((key) => {
  url.set(key, query[key] as string);
});
if (props.category) {
  url.set("productTypeId", props.category.id.toString());
}
const breadUrl = `${link}?${url.toString()}`;
</script>
<template>
  <div class="flex gap-4 items-center px-4">
    <div>
      <NuxtLink to="/" class="font-medium">Home</NuxtLink>
    </div>
    <Icon v-if="category" name="icon-park-outline:right" class="font-bold" />
    <div class="flex gap-4 flex-row-reverse items-center" v-if="category">
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
    </div>
  </div>
</template>
