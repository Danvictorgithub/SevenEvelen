<script setup lang="ts">
import type { Category } from "~/components/Header.vue";

const API = useRuntimeConfig().public.API;
const { data: categories } = await useFetch<Array<Category>>(`${API}/category`);
const showMore = ref(false);
const showFilter = ref(false);
</script>
<template>
  <Header />
  <main class="min-h-svh">
    <section class="container mx-auto my-12 flex">
      <div
        class="w-[300px] bg-white fixed lg:static h-full top-0 left-0 overflow-scroll duration-200"
        :class="showFilter ? '' : '-translate-x-full lg:translate-x-0'"
      >
        <button
          class="lg:hidden flex gap-2 text p-2 hover:bg-slate-100 w-full items-center"
          @click="showFilter = false"
        >
          <Icon name="material-symbols:arrow-left-alt" class="text-3xl my-6" />
          <!-- <p class="text-lg font-medium text-center">Categories</p> -->
        </button>
        <p class="font-black p-4">Categories</p>
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
        <p class="font-black my-4 p-4">Price</p>
        <div class="flex gap-4 p-4">
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
        <div class="p-4">
          <button
            class="font-bold text-center p-3 bg-green-500 hover:bg-green-500 text-white rounded-xl my-4 w-full"
          >
            Apply Query
          </button>
        </div>
      </div>
      <div class="flex flex-col items-start justify-between w-full">
        <!-- Mobile Query -->
        <div class="w-full px-4 block lg:hidden">
          <div class="flex justify-between items-center gap-4 w-full">
            <button
              class="basis-0 flex-1 font-bold rounded-xl p-4 text-white bg-green-500"
            >
              Best Match
            </button>
            <button
              class="basis-0 flex-1 font-bold rounded-xl p-4 border flex gap-4 items-center justify-center"
            >
              Price <Icon name="teenyicons:up-solid" />
            </button>
            <button
              class="basis=0 flex-1 font-bold rounded-xl p-4 border flex gap-4 items-center justify-center"
              @click="showFilter = true"
            >
              <Icon name="iconoir:filter-solid" />Filter
            </button>
          </div>
          <div class="py-2">
            <p class="font-bold text-xl">mouse</p>
            <p class="mt-2">2607 items found for "mouse"</p>
          </div>
        </div>

        <div class="items-start justify-between w-full p-4 hidden lg:flex">
          <div class="">
            <p class="font-bold text-xl">mouse</p>
            <p class="mt-2">2607 items found for "mouse"</p>
          </div>
          <div class="flex items-center justify-center">
            <label class="w-24 text-sm font-medium text-gray-900"
              >Sort By:</label
            >
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
        <div
          class="w-full grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 my-12 p-4"
        >
          <div class="max-w-2xl" v-for="i in 10">
            <div class="bg-white border rounded-xl max-w-sm">
              <a href="#">
                <img
                  class="rounded-xl overflow-hidden border"
                  src="https://i.ibb.co/KqdgGY4/cosmetic-packaging-mockup-1150-40280.webp"
                  alt="product image"
                />
              </a>
              <div class="px-5 py-5">
                <a href="#">
                  <h3
                    class="text-gray-900 font-semibold text-sm lg:text-xl tracking-tight"
                  >
                    Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport
                  </h3>
                </a>

                <div class="flex items-center justify-between mt-4">
                  <span class="text-base lg:text-3xl font-bold text-gray-900"
                    >₱599</span
                  >
                  <a
                    href="#"
                    class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2.5 py-1.5 lg:px-5 lg:py-2.5 text-center :bg-green-500 :ring-green-600"
                    >Add to cart</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>
