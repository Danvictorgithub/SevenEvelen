<script setup lang="ts">
const isSideBarOpen = ref(false);
</script>
<template>
  <aside
    class="max-w-[300px] lg:max-w-[400px] w-full h-full lg:h-auto p-4 bg-green-500 text-white fixed top-0 lg:relative duration-200 lg:-translate-x-0 z-[2000]"
    :class="{ '-translate-x-full': !isSideBarOpen }"
  >
    <button
      @click="isSideBarOpen = !isSideBarOpen"
      class="absolute top-1/2 -right-8 bg-green-500 rounded-full aspect-square p-4 block lg:hidden"
    >
      <Icon
        name="material-symbols:arrow-right-alt"
        class="text-3xl"
        v-if="!isSideBarOpen"
      />
      <Icon name="material-symbols:arrow-left-alt" class="text-3xl" v-else />
    </button>
    <div class="font-bold mt-12 flex items-center gap-2 justify-center">
      <Icon name="eos-icons:admin" class="text-5xl" />
      <p class="text-xl lg:text-2xl">Admin Dashboard</p>
    </div>
    <div class="mt-12">
      <p class="font-medium text-xl text-center">Menu</p>
      <div class="mt-6 flex flex-col gap-2 z-10">
        <NuxtLink
          to="/admin"
          class="px-4 flex gap-4 items-center p-4 rounded-xl"
        >
          <Icon name="material-symbols:dashboard" class="text-2xl" />
          <p class="font-medium text-lg">Dashboard</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/stores"
          class="px-4 flex gap-4 items-center p-4 rounded-xl"
        >
          <Icon name="material-symbols:dashboard" class="text-2xl" />
          <p class="font-medium text-lg">Stores</p>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
<style scoped>
.router-link-active.router-link-exact-active {
  @apply bg-green-600;
}
</style>
