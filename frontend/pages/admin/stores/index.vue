<script setup lang="ts">
const name = ref("");
const take = ref(10);
const skip = ref(10);
const endFetch = ref(false);
watch(name, () => {
  skip.value = 10;
  endFetch.value = false;
});

const { token } = useAuth();
const API = useRuntimeConfig().public.API;
const { data: stores } = await useFetch<StoreType[]>(`${API}/stores`, {
  headers: {
    Authorization: token.value as string,
  },
  query: {
    take: take.value,
    skip: 0,
    name,
  },
  watch: [name],
});
const { data: storeCount } = await useFetch<string>(`${API}/stores/count`, {
  headers: {
    Authorization: token.value as string,
  },
  query: {
    name,
  },
  watch: [name],
});
const { data: topStores } = await useFetch<StoreType[]>(`${API}/stats/store`, {
  headers: {
    Authorization: token.value as string,
  },
});
async function getMoreStore() {
  if (endFetch.value) {
    return;
  }
  const data = await $fetch<StoreType[]>(`${API}/stores`, {
    headers: {
      Authorization: token.value as string,
    },
    query: {
      take: take.value,
      skip: skip.value,
      name: name.value,
    },
  }).catch((err) => {});
  skip.value += take.value;
  if (data) {
    if (data.length > 0) stores.value?.push(...(data as any));
    else endFetch.value = true;
    if (skip.value - take.value === parseInt(storeCount.value as string)) {
      endFetch.value = true;
    }
  }
}
const el = ref(null);
useInfiniteScroll(el, await getMoreStore, { distance: 3000 });
</script>
<template>
  <div class="h-screen overflow-scroll" ref="el">
    <Header />
    <main class="min-h-svh flex">
      <AdminSideBar />
      <section class="bg-slate-100 w-full p-4">
        <div class="container px-6 py-10 mx-auto bg-white rounded-xl">
          <section class="bg-white">
            <div class="h-[32rem] bg-gray-100">
              <div class="container px-6 py-10 mx-auto">
                <h1
                  class="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl"
                >
                  Top 3 High-Selling Stores
                </h1>

                <div class="flex justify-center mx-auto mt-6">
                  <span
                    class="inline-block w-40 h-1 bg-green-500 rounded-full"
                  ></span>
                  <span
                    class="inline-block w-3 h-1 mx-1 bg-green-500 rounded-full"
                  ></span>
                  <span
                    class="inline-block w-1 h-1 bg-green-500 rounded-full"
                  ></span>
                </div>

                <p class="max-w-2xl mx-auto mt-6 text-center text-gray-500">
                  Statistics have shown exceptional management in sells report
                  in these stores
                </p>
              </div>
            </div>

            <div
              class="container px-6 py-10 mx-auto -mt-72 sm:-mt-80 md:-mt-96"
            >
              <div
                class="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-3"
              >
                <NuxtLink
                  v-for="i in 3"
                  :to="`/admin/stores/${topStores![i-1].id}`"
                  class="flex flex-col items-center p-4 border sm:p-6 rounded-xl"
                >
                  <img
                    class="object-cover w-full rounded-xl aspect-square"
                    :src="topStores![i-1].image"
                    alt=""
                  />

                  <h1
                    class="mt-4 text-2xl font-semibold text-gray-700 capitalize"
                  >
                    {{ topStores![i - 1].name }}
                  </h1>

                  <p class="mt-2 text-gray-500 capitalize text-center">
                    {{ topStores![i - 1].address }}
                  </p>
                  <p class="mt-4 text-gray-600">
                    Products Sold: {{ topStores![i - 1].noProductSold }}
                  </p>
                </NuxtLink>
              </div>
            </div>
          </section>

          <div class="flex items-center justify-between flex-col lg:flex-row">
            <div class="flex-col flex items-center lg:items-start">
              <h1
                class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl"
              >
                stores
              </h1>
              <p>No: {{ storeCount }}</p>
              <NuxtLink :to="`/admin/stores/create`">
                <button
                  class="border p-2 rounded-xl my-4 border-transparent bg-green-500 text-white font-medium hover:bg-white hover:border-green-500 hover:text-green-500 duration-200"
                >
                  Create Store
                </button>
              </NuxtLink>
            </div>

            <div class="relative flex items-center mt-4 md:mt-0">
              <span class="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 mx-3 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </span>

              <input
                v-model="name"
                type="text"
                placeholder="Search"
                class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5"
              />
            </div>
          </div>

          <hr class="my-8 border-gray-200" />

          <div
            class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 items-center justify-center"
          >
            <NuxtLink
              :to="`/admin/stores/${store.id}`"
              v-for="store in stores"
              :key="store.id"
              class="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg mx-auto"
            >
              <img
                class="object-cover object-center w-full h-56"
                :src="store.image"
                alt="avatar"
              />

              <div class="flex items-center px-6 py-3 bg-gray-900">
                <Icon name="mdi:clock-outline" class="text-white text-2xl" />

                <h1 class="mx-3 text-lg font-semibold text-white">
                  {{ store.opening_hours }}
                </h1>
              </div>

              <div class="px-6 py-4">
                <h1 class="text-xl font-semibold text-gray-800">
                  {{ store.name }}
                </h1>

                <p class="py-2 text-gray-700">
                  {{ store.address }}
                </p>

                <div class="flex items-center mt-4 text-gray-700">
                  <Icon name="fluent-mdl2:product" class="text-2xl" />

                  <h1 class="px-2 text-sm">{{ store._count.products }}</h1>
                </div>

                <div class="flex items-center mt-4 text-gray-700">
                  <Icon name="uiw:date" class="text-2xl" />
                  <NuxtTime
                    :datetime="store.createdAt"
                    month="long"
                    day="numeric"
                    year="numeric"
                    class="px-2 text-sm"
                  />
                </div>
                <div class="flex items-center mt-4 text-gray-700">
                  <Icon name="bi:geo" class="text-2xl" />

                  <h1 class="px-2 text-sm">
                    {{ store.long }} - {{ store.lat }}
                  </h1>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
