<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const { token } = useAuth();

const { data: locations } = await useFetch(`${API}/stores/locations`, {
  headers: {
    Authorization: token.value as string,
  },
  transform: (data: Array<{ long: string; lat: string }>) => {
    const parsedData = data.reduce((acc, obj) => {
      acc.push([Number(obj.lat), Number(obj.long)]);
      return acc;
    }, [] as Array<[number, number]>);
    const filteredData = parsedData.filter((data) =>
      data[0] && data[1] ? true : false
    );
    return filteredData;
  },
});
interface TransactionsByMonth {
  [key: string]: number;
}
interface TransactionsThisWeek extends TransactionsByMonth {}
const { data: stats } = await useFetch<{
  totalEarning: number;
  noStores: number;
  noProducts: number;
  noUsers: number;
  transactionsByMonth: TransactionsByMonth;
  transactionsThisWeek: TransactionsThisWeek;
}>(`${API}/stats`, {
  headers: {
    Authorization: token.value as string,
  },
});
const monthlyProfit = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const weeklyProfit = ref([0, 0, 0, 0, 0, 0, 0, 0]);
Object.keys(stats.value!.transactionsByMonth).forEach((key) => {
  monthlyProfit.value[parseInt(key)] = Math.floor(
    stats.value!.transactionsByMonth[key]
  ) as number;
});
Object.keys(stats.value!.transactionsThisWeek).forEach((key) => {
  weeklyProfit.value[parseInt(key)] = Math.floor(
    stats.value!.transactionsThisWeek[key]
  ) as number;
});

const series1 = ref([
  {
    name: "Monthly Profit",
    data: monthlyProfit.value,
  },
]);
const chartOptions1 = ref({
  colors: ["#22c55e"],
  title: {
    text: "Total Revenue",
  },
  stroke: {
    curve: "smooth",
  },
  chart: {
    id: "vuechart-example",
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
});

const series2 = ref([{ name: "Weekly Profit", data: weeklyProfit.value }]);
const chartOptions2 = ref({
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
  <main class="min-h-svh flex relative">
    <AdminSideBar />
    <section class="bg-slate-100 w-full p-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 my-6 gap-4">
        <div class="bg-white p-4 rounded-xl">
          <div class="flex">
            <div class="bg-slate-50 p-4 rounded-full aspect-square">
              <Icon name="tdesign:money" class="text-3xl text-green-500" />
            </div>
          </div>
          <p class="text-2xl font-bold">
            ₱{{ Number(stats?.totalEarning).toFixed(2) }}
          </p>
          <p class="font-medium text-gray-500">Total Earning</p>
        </div>
        <div class="bg-white p-4 rounded-xl">
          <div class="flex">
            <div
              class="bg-slate-50 p-4 rounded-full aspect-square text-green-500"
            >
              <Icon name="material-symbols:store" class="text-3xl" />
            </div>
          </div>
          <p class="text-2xl font-bold">{{ stats?.noStores }}</p>
          <p class="font-medium text-gray-500">No. Stores</p>
        </div>
        <div class="bg-white p-4 rounded-xl">
          <div class="flex">
            <div
              class="bg-slate-50 p-4 rounded-full aspect-square text-green-500"
            >
              <Icon name="icon-park-outline:ad-product" class="text-3xl" />
            </div>
          </div>
          <p class="text-2xl font-bold">{{ stats?.noProducts }}</p>
          <p class="font-medium text-gray-500">No. Products</p>
        </div>
        <div class="bg-white p-4 rounded-xl">
          <div class="flex">
            <div class="bg-slate-50 p-4 rounded-full aspect-square">
              <Icon
                name="heroicons:user-solid"
                class="text-3xl text-green-500"
              />
            </div>
          </div>
          <p class="text-2xl font-bold">{{ stats?.noUsers }}</p>
          <p class="font-medium text-gray-500">No. Users</p>
        </div>
      </div>
      <div class="flex-col lg:flex-row flex gap-4">
        <div class="bg-white p-4 flex-1 basis-0 rounded-xl">
          <ClientOnly>
            <apexchart
              type="line"
              :height="500"
              :options="chartOptions1"
              :series="series1"
            />
          </ClientOnly>
        </div>
        <div
          class="flex-1 basis-0 max-w-auto lg:max-w-[500px] bg-white rounded-xl p-4"
        >
          <ClientOnly>
            <apexchart
              type="bar"
              :height="500"
              :options="chartOptions2"
              :series="series2"
            />
          </ClientOnly>
        </div>
      </div>
      <div class="w-full rounded-xl mt-6 bg-white p-4">
        <p class="font-bold text-gray-900 text-center text-xl my-4">
          Store Locations
        </p>
        <div class="h-[500px] aspect-square rounded-xl overflow-hidden">
          <LMap ref="map" :zoom="5.2" :center="[12.8797, 121.774]">
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              layer-type="base"
              name="OpenStreetMap"
            />
            <LMarker :lat-lng="location" v-for="location in locations" />
          </LMap>
        </div>
      </div>
    </section>
  </main>
  <Footer />
</template>
