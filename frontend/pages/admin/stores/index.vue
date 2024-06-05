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
useInfiniteScroll(el, await getMoreStore, { distance: 500 });
</script>
<template>
  <div class="h-screen overflow-scroll" ref="el">
    <Header />
    <main class="min-h-svh flex">
      <AdminSideBar />
      <section class="bg-slate-100 w-full p-4">
        <div class="container px-6 py-10 mx-auto bg-white rounded-xl">
          <div class="flex items-center justify-between flex-col lg:flex-row">
            <div class="flex-col flex items-center lg:items-start">
              <h1
                class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl"
              >
                stores
              </h1>
              <p>No: {{ storeCount }}</p>
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
