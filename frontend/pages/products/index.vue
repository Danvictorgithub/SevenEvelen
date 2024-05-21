<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const { data: categories } = await useFetch<Array<Category>>(`${API}/category`);
const showMore = ref(false);
</script>
<template>
  <Header />
  <main class="min-h-svh">
    <section class="container mx-auto my-12 flex">
      <div class="w-[300px]">
        <p class="font-black">Categories</p>
        <div class="flex flex-col gap-2 p-4 border-b" v-auto-animate>
          <p class="font-bold">All</p>
          <div v-for="category in categories">
            <p class="font-bold">{{ category.name }}</p>
            <div
              class="p-2"
              v-for="subCategory in category.productTypes"
              v-if="showMore"
            >
              <p class="font-normal">{{ subCategory.name }}</p>
            </div>
          </div>
          <button
            class="font-bold text-green-500"
            @click="showMore = false"
            v-if="showMore"
          >
            View Less
          </button>
          <button
            class="font-bold text-green-500"
            @click="showMore = true"
            v-else
          >
            View More
          </button>
        </div>
      </div>
      <div class="flex items-start justify-between w-full">
        <div>
          <p class="font-bold text-xl">mouse</p>
          <p class="mt-2">2607 items found for "mouse"</p>
        </div>
        <div class="flex items-center justify-center">
          <label class="w-24 text-sm font-medium text-gray-900">Sort By:</label>
          <select
            class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :ring-blue-500 :border-blue-500"
          >
            <option value="CA">Best Match</option>
            <option value="FR">Price low to high</option>
            <option value="DE">Price high to low</option>
          </select>
          <label class="w-16 text-sm font-medium text-gray-900 ml-4"
            >view:</label
          >
          <div class="flex items-center gap-4 justify-center">
            <Icon name="ion:grid" />
            <Icon name="fa-solid:list" />
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>
