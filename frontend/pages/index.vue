<script setup lang="ts">
const API = useRuntimeConfig().public.API;
</script>
<template>
  <Header />
  <main class="min-h-svh">
    <section class="container mx-auto py-12">
      <div class="border rounded-xl h-[512px] overflow-hidden">
        <img src="/pepsi.jpg" class="w-full h-full object-cover" alt="" />
      </div>
    </section>
    <section
      class="container mx-auto flex flex-wrap gap-4 items-center justify-center lg:grid lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]"
    >
      <div class="flex-1 basis-0 min-w-[300px] shrink-1" v-for="i in 3">
        <h2 class="text-center font-bold border-b text-lg lg:text-xl pb-4">
          New Arrival
        </h2>
        <div class="p-4">
          <div class="flex border rounded-xl p-4 mb-4" v-for="i in 5">
            <img
              src="/logo.png"
              class="w-16 h-16 md:h-24 md:w-24 rounded-xl"
              alt=""
            />
            <div class="flex-1 px-4 flex flex-col">
              <p class="font-bold">Seven Eleven</p>
              <p class="text-sm md:text-base">Logo</p>
              <p class="text-green-500 font-black flex-1 flex items-end">
                ₱100
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto min-h-[50svh] mt-12">
      <h3 class="font-bold text-lg lg:text-xl pb-4 border-b">
        Deal of the Day
      </h3>
      <div
        class="max-w-[1000px] mx-auto border rounded-xl my-12 p-4 flex flex-col lg:flex-row items-center justify-center"
      >
        <div class="flex-1 basis-0">
          <img src="/logo.png" class="aspect-square rounded-xl" alt="" />
        </div>
        <div class="flex flex-col flex-1 basis-0 p-4 w-full">
          <p class="font-bold text-base lg:text-lg">Seven Eleven</p>
          <p class="text-sm md:text-lg">Logo</p>

          <p class="text-lg">From : Tagbina Branch</p>
          <div class="flex-1 flex flex-col justify-center">
            <p class="text-green-500 font-black text-3xl my-6">₱100</p>
            <button
              class="bg-green-500 text-base lg:text-lg rounded-xl p-3 text-white font-bold duration-200 hover:bg-green-600"
            >
              Add To Cart
            </button>
            <div class="flex items-center justify-between p-4">
              <p>Users that added to cart: <span class="font-bold">5</span></p>
              <p>Stocks: <span class="font-bold">5</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto my-12">
      <h3 class="font-bold text-lg lg:text-xl pb-4 border-b">Products</h3>
      <div
        class="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 my-12 p-4 lg:p-0"
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
    </section>
  </main>
  <Footer />
</template>
