<script setup lang="ts">
import type { Category } from "~/components/Header.vue";

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
        <p class="font-black my-4">Price</p>
        <div class="flex gap-4">
          <div>
            <label for="card" class="block text-sm text-gray-500 text-center"
              >Min Price</label
            >

            <div class="relative flex items-center mt-2">
              <input
                min="0"
                max="99999"
                type="number"
                placeholder="0"
                class="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 focus:border-blue-400 :border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
          </div>
          <div>
            <label for="card" class="block text-sm text-gray-500 text-center"
              >Max Price</label
            >

            <div class="relative flex items-center mt-2">
              <input
                type="number"
                min="0"
                max="99999"
                placeholder="99999"
                class="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 focus:border-blue-400 :border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
          </div>
        </div>
        <button
          class="font-bold text-center p-3 bg-green-500 hover:bg-green-500 text-white rounded-xl my-4 w-full"
        >
          Apply Query
        </button>
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
