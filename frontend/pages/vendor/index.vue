<script setup lang="ts">
const { data, token } = useAuth();
const API = useRuntimeConfig().public.API;
const { error } = await useFetch<VendorType>(`${API}/user_vendor`, {
  headers: { Authorization: token.value as string },
});
const { data: stats } = await useFetch<{
  totalProfit: number;
  noAssociatedStores: number;
  noProducts: number;
  noItemsSold: number;
  weekProfit: number;
  reordersThisWeek: { [key: string]: number };
}>(`${API}/user_vendor/stats`, {
  headers: {
    Authorization: token.value as string,
  },
});
const weeklyProfit = ref([0, 0, 0, 0, 0, 0, 0, 0]);
Object.keys(stats.value!.reordersThisWeek).forEach((key) => {
  weeklyProfit.value[parseInt(key)] = Math.floor(
    stats.value!.reordersThisWeek[key]
  ) as number;
});
const series = ref([{ name: "Weekly Profit", data: weeklyProfit.value }]);
const chartOptions = ref({
  colors: ["#22c55e"],
  title: {
    text: "Weekly Revenue",
  },
  stroke: {
    curve: "smooth",
  },
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
});
</script>
<template>
  <Header />
  <main class="min-h-svh flex">
    <VendorSideBar />
    <section class="p-4 flex-1 min-h-screen container mx-auto" v-if="!error">
      <section>
        <h2 class="font-bold text-2xl text-gray-700 py-4">
          Analytics Overview
        </h2>
        <div
          class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 w-full items-center justify-center"
        >
          <div
            class="border h-[250px] flex flex-col items-center justify-center gap-4"
          >
            <div
              class="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center"
            >
              <Icon name="tdesign:money" class="text-3xl text-green-500" />
            </div>
            <div class="text-center">
              <p class="text-5xl font-bold text-gray-700">
                {{ stats?.totalProfit }}
              </p>
              <p class="font-medium text-gray-500">Total Profit</p>
            </div>
          </div>
          <div
            class="border h-[250px] flex flex-col items-center justify-center gap-4"
          >
            <div
              class="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center"
            >
              <Icon
                name="icon-park-outline:ad-product"
                class="text-3xl text-green-500"
              />
            </div>
            <div class="text-center">
              <p class="text-5xl font-bold text-gray-700">
                {{ stats?.noProducts }}
              </p>
              <p class="font-medium text-gray-500">No Products</p>
            </div>
          </div>
          <div
            class="border h-[250px] flex flex-col items-center justify-center gap-4"
          >
            <div
              class="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center"
            >
              <Icon
                name="material-symbols:store"
                class="text-3xl text-green-500"
              />
            </div>
            <div class="text-center">
              <p class="text-5xl font-bold text-gray-700">
                {{ stats?.noAssociatedStores }}
              </p>
              <p class="font-medium text-gray-500">Associated Stores</p>
            </div>
          </div>
          <div
            class="border h-[250px] flex flex-col items-center justify-center gap-4"
          >
            <div
              class="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center"
            >
              <Icon name="ep:sold-out" class="text-3xl text-green-500" />
            </div>
            <div class="text-center">
              <p class="text-5xl font-bold text-gray-700">
                {{ stats?.noItemsSold }}
              </p>
              <p class="font-medium text-gray-500">No Items Sold</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2 class="font-bold text-2xl text-gray-700 py-4">
          This Weeks Analytics
        </h2>
        <div class="flex flex-col lg:flex-row">
          <div
            class="border basis-0 lg:basis-[250px] w-full lg:w-[500px] flex flex-col items-center justify-center gap-4 p-4"
          >
            <div
              class="h-20 w-20 bg-green-200 rounded-full flex items-center justify-center"
            >
              <Icon name="tdesign:money" class="text-3xl text-green-500" />
            </div>
            <div class="text-center">
              <p class="text-5xl font-bold text-gray-700">
                {{ stats?.totalProfit }}
              </p>
              <p class="font-medium text-gray-500">Total Profit</p>
            </div>
          </div>
          <div class="bg-white p-4 flex-1 basis-0 rounded-xl w-full h-full">
            <ClientOnly>
              <apexchart
                type="line"
                :height="500"
                :options="chartOptions"
                :series="series"
              />
            </ClientOnly>
          </div>
        </div>
      </section>
    </section>
    <section class="flex items-center justify-center flex-1 flex-col" v-else>
      <Icon name="ic:twotone-error" class="text-yellow-500 text-7xl" />
      <h3 class="font-bold text-slate-700 text-4xl text-center">
        No Vendor Profile Found
      </h3>
    </section>
  </main>
  <Footer />
</template>
