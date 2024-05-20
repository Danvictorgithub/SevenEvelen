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
    <section class="container mx-auto h-svh">
      <h3 class="font-bold text-lg lg:text-xl">Deal of the Day</h3>
    </section>
  </main>
  <Footer />
</template>
