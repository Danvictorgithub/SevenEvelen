<script setup lang="ts">
const loading = loadingStore();
const showDeleteConfirmationModal = ref(false);
const { id } = useRoute().params;
const take = ref(10);
const skip = ref(10);
const endFetch = ref(false);

const { token } = useAuth();
const API = useRuntimeConfig().public.API;
const { data: store, error } = await useFetch<StoreType>(
  `${API}/stores/${id}`,
  {
    headers: {
      Authorization: token.value as string,
    },
  }
);
const { data: products } = await useFetch<ProductType[]>(`${API}/products`, {
  query: {
    storeId: id,
    take: take.value,
    skip: 0,
  },
});
const { data: count } = await useFetch<string>(`${API}/products/count`, {
  query: {
    storeId: id,
    take: take.value,
    skip: 0,
  },
});
if (error.value) {
  throw createError({ statusCode: 404, message: "Store not found" });
}

const showMap = ref(false);

async function getMoreProducts() {
  if (endFetch.value) {
    return;
  }
  const data = await $fetch<StoreType[]>(`${API}/products`, {
    headers: {
      Authorization: token.value as string,
    },
    query: {
      take: take.value,
      skip: skip.value,
      storeId: id,
    },
  }).catch((err) => {});
  skip.value += take.value;
  if (data) {
    if (data.length > 0) products.value?.push(...(data as any));
    else endFetch.value = true;
    if (skip.value - take.value === parseInt(count.value as string)) {
      endFetch.value = true;
    }
  }
}

async function deleteStore() {
  const data = await $fetch(`${API}/stores/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token.value as string,
    },
  })
    .then((res) => {
      if (res) {
        navigateTo("/admin/stores");
      }
    })
    .catch((err) => {
      const e = errorStore();
      e.value.showError = true;
      if (err.data) {
        e.value.message = err.data.message;
      } else {
        e.value.message = "The server is not responding";
      }
    });
}
const el = ref(null);
useInfiniteScroll(el, await getMoreProducts, { distance: 3000 });
</script>
<template>
  <div class="h-screen overflow-scroll" ref="el">
    <Header />
    <main class="min-h-svh flex">
      <AdminSideBar />
      <section class="bg-slate-100 w-full p-4">
        <UModal v-model="showMap" :ui="{ container: 'items-center' }">
          <section class="p-4">
            <p class="text-xl font-bold">Map Location</p>
            <div class="h-[500px] aspect-square rounded-xl overflow-hidden">
              <LMap
                ref="map"
                :zoom="15"
                :center="[parseInt(store?.lat as string),parseInt(store?.long as string)]"
              >
                <LTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  layer-type="base"
                  name="OpenStreetMap"
                />
                <LMarker
                  :lat-lng="[parseInt(store?.lat as string),parseInt(store?.long as string)]"
                />
              </LMap>
            </div>
          </section>
        </UModal>
        <div class="container px-6 py-10 mx-auto bg-white rounded-xl">
          <h1
            class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white"
          >
            Store Information
          </h1>

          <div class="mt-8 lg:-mx-6 lg:flex lg:items-center">
            <img
              class="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96"
              :src="store!.image"
              @error="imageHandling"
              alt=""
            />

            <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
              <div class="flex gap-2 item-center text-green-500">
                <Icon name="mdi:clock" />
                <p class="text-sm uppercase">
                  {{ store!.opening_hours }} Opening Hours
                </p>
              </div>

              <a
                href="#"
                class="block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white"
              >
                {{ store!.name }}
              </a>

              <p
                class="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm"
              >
                {{ store!.address }}
              </p>

              <button
                @click="showMap = true"
                class="flex items-center mt-6 hover:border-green-500 rounded-xl px-4 py-2 border border-transparent"
              >
                <Icon name="fluent:earth-32-filled" />
                <div class="mx-4">
                  <h1 class="text-sm text-gray-700 dark:text-gray-200">
                    {{ store!.long }}
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ store!.lat }}
                  </p>
                </div>
              </button>
              <div @click="showDeleteConfirmationModal = true" class="mt-4">
                <button
                  class="flex items-center gap-2 py-2 px-3 border border-transparent bg-red-500 hover:bg-white hover:border-red-500 hover:text-red-500 duration-200 rounded-xl text-white"
                >
                  Delete Store
                </button>
              </div>
              <UModal v-model="showDeleteConfirmationModal">
                <div class="p-4 flex items-center flex-col">
                  <Icon
                    name="clarity:info-solid"
                    class="text-7xl text-yellow-500"
                  />
                  <p>Are you sure you want to delete this store?</p>
                  <button
                    @click="setLoading(deleteStore)"
                    class="flex items-center gap-2 my-4 px-3 py-2 border border-transparent bg-green-500 hover:border-green-500 hover:bg-white hover:text-green-500 text-white rounded-xl"
                  >
                    <Icon
                      name="line-md:loading-twotone-loop"
                      v-if="loading.loading"
                    />
                    Delete Store
                  </button>
                  <p class="text-sm text-gray-500">
                    note: this will delete products and its external information
                    in the system
                  </p>
                </div>
              </UModal>
            </div>
          </div>
          <hr class="mt-12" />
          <div class="flex mt-12 items-center justify-between">
            <h1
              class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white"
            >
              Products
            </h1>
            <p class="">No: {{ count }}</p>
          </div>
          <div
            class="w-full grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 my-12 p-4"
          >
            <StoreProduct
              v-for="product in new Set(products)"
              :product="product"
              :show-cart="false"
            />
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
