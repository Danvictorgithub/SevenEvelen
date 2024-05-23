<script setup lang="ts">
const API = useRuntimeConfig().public.API;
export interface Product {
  id: number;
  markupRate: number;
  stock: number;
  product: {
    name: string;
    image: string;
    upcCode: string;
    size: string;
    originalPrice: number;
    productType: { name: string };
    brand: {
      name: string;
      image: string;
    };
    vendor: {
      name: string;
      image: string;
    };
  };
  userCart: number;
}
const { data: newArrival } = await useFetch<Array<Product>>(
  `${API}/products/newArrivals`
);
const { data: trendingProducts } = await useFetch<Array<Product>>(
  `${API}/products/trendingProducts`
);
const { data: topProducts } = await useFetch<Array<Product>>(
  `${API}/products/mostBoughtProducts`
);
const { data: dealProduct } = await useFetch<Product>(
  `${API}/products/randomProduct`
);
const el = ref(null);
const skip = ref(0);
const take = ref(10);
const limit = ref(100);
const endFetch = ref(false);

const { data: products } = await useFetch<Array<Product>>(`${API}/products`, {
  query: {
    take: take.value,
    skip: skip.value,
  },
});
const items = [
  "/pepsi.jpg",
  "/evelen.jpg",
  "/coke.jpg",
  "/evelen2.jpg",
  "/evelen3.jpg",
  "/evelen4.jpg",
];
const carouselRef = ref();

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return;

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0);
    }

    carouselRef.value.next();
  }, 3000);
});

async function getMoreProducts() {
  if (endFetch.value) {
    return;
  }
  const data = await $fetch<Array<Product>>(`${API}/products`, {
    params: {
      skip: skip.value,
      take: take.value,
    },
  }).catch((err) => {});
  skip.value += take.value;
  if (data) {
    if (data.length > 0) products.value?.push(...(data as any));
    else endFetch.value = true;
    if (skip.value === limit.value) {
      endFetch.value = true;
    }
  }
}
useInfiniteScroll(el, await getMoreProducts, { distance: 200 });
function imageHandling(e: Event) {
  const HTMLImage = e.target as HTMLImageElement;
  HTMLImage.src = "/logo.png";
}
</script>
<template>
  <div class="h-screen overflow-scroll" ref="el">
    <Header />
    <main class="min-h-svh bg-white">
      <section class="container mx-auto py-12">
        <UCarousel
          ref="carouselRef"
          v-slot="{ item }"
          :items="items"
          :ui="{ item: 'basis-full h-[512px]' }"
          class="rounded-lg overflow-hidden"
          :prev-button="{
            color: 'white',
          }"
          :next-button="{
            color: 'white',
          }"
          arrows
          indicators
        >
          <img :src="item" class="w-full object-cover" draggable="false" />
        </UCarousel>
        <!-- <div class="border rounded-xl h-[512px] overflow-hidden">
        <img src="/pepsi.jpg" class="w-full h-full object-cover" alt="" />
      </div> -->
      </section>
      <section
        class="container mx-auto flex flex-wrap gap-4 items-center justify-center lg:grid lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]"
      >
        <div class="flex-1 basis-0 min-w-[300px] shrink-1">
          <h2 class="text-center font-bold border-b text-lg lg:text-xl pb-4">
            New Arrival
          </h2>
          <div class="p-4">
            <NuxtLink
              :to="`/products/${item.id}`"
              class="flex border rounded-xl p-4 mb-4"
              v-for="item in newArrival"
              :key="item.id"
            >
              <img
                :src="item.product.image"
                class="w-16 h-16 md:h-24 md:w-24 rounded-xl"
                alt=""
                @error="imageHandling"
              />
              <div class="flex-1 px-4 flex flex-col">
                <p class="font-bold">{{ item.product.name }}</p>
                <p class="text-sm md:text-base">
                  {{ item.product.productType.name }}
                </p>
                <p class="text-green-500 font-black flex-1 flex items-end">
                  ₱{{
                    (
                      item.product.originalPrice +
                      (item.markupRate / 100) * item.product.originalPrice
                    ).toFixed(2)
                  }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1 basis-0 min-w-[300px] shrink-1">
          <h2 class="text-center font-bold border-b text-lg lg:text-xl pb-4">
            Trending Products
          </h2>
          <div class="p-4">
            <NuxtLink
              :to="`/products/${item.id}`"
              class="flex border rounded-xl p-4 mb-4"
              v-for="item in trendingProducts"
              :key="item.id"
            >
              <img
                :src="item.product.image"
                class="w-16 h-16 md:h-24 md:w-24 rounded-xl"
                alt=""
                @error="imageHandling"
              />
              <div class="flex-1 px-4 flex flex-col">
                <p class="font-bold">{{ item.product.name }}</p>
                <p class="text-sm md:text-base">
                  {{ item.product.productType.name }}
                </p>
                <p class="text-green-500 font-black flex-1 flex items-end">
                  ₱{{
                    (
                      item.product.originalPrice +
                      (item.markupRate / 100) * item.product.originalPrice
                    ).toFixed(2)
                  }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="flex-1 basis-0 min-w-[300px] shrink-1">
          <h2 class="text-center font-bold border-b text-lg lg:text-xl pb-4">
            Top Products
          </h2>
          <div class="p-4">
            <NuxtLink
              :to="`/products/${item.id}`"
              class="flex border rounded-xl p-4 mb-4"
              v-for="item in topProducts"
              :key="item.id"
            >
              <img
                :src="item.product.image"
                class="w-16 h-16 md:h-24 md:w-24 rounded-xl"
                alt=""
                @error="imageHandling"
              />
              <div class="flex-1 px-4 flex flex-col">
                <p class="font-bold">{{ item.product.name }}</p>
                <p class="text-sm md:text-base">
                  {{ item.product.productType.name }}
                </p>
                <p class="text-green-500 font-black flex-1 flex items-end">
                  ₱{{
                    (
                      item.product.originalPrice +
                      (item.markupRate / 100) * item.product.originalPrice
                    ).toFixed(2)
                  }}
                </p>
              </div>
            </NuxtLink>
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
          <NuxtLink :to="`/products/${dealProduct?.id}`" class="flex-1 basis-0">
            <img
              :src="dealProduct?.product.image"
              class="aspect-square rounded-xl"
              alt=""
              @error="imageHandling"
            />
          </NuxtLink>
          <div class="flex flex-col flex-1 basis-0 p-4 w-full">
            <p class="font-bold text-base lg:text-lg">
              {{ dealProduct?.product.name }}
            </p>
            <p class="text-sm md:text-lg">
              {{ dealProduct?.product.productType.name }}
            </p>

            <p class="text-lg">From : {{ dealProduct?.product.vendor.name }}</p>
            <div class="flex-1 flex flex-col justify-center">
              <p class="text-green-500 font-black text-3xl my-6">
                ₱{{
                  (
                    dealProduct!.product.originalPrice +
                    (dealProduct!.markupRate / 100) *
                      dealProduct!.product!.originalPrice
                  ).toFixed(2)
                }}
              </p>
              <button
                class="bg-green-500 text-base lg:text-lg rounded-xl p-3 text-white font-bold duration-200 hover:bg-green-600"
              >
                Add To Cart
              </button>
              <div class="flex items-center justify-between p-4">
                <p>
                  Users that added to cart:
                  <span class="font-bold">{{ dealProduct?.userCart }}</span>
                </p>
                <p>
                  Stocks:
                  <span class="font-bold">{{ dealProduct?.stock }}</span>
                </p>
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
          <div class="max-w-2xl" v-for="item in products" :key="item.id">
            <div class="bg-white border rounded-xl max-w-sm">
              <NuxtLink :to="`/products/${item.id}`">
                <img
                  class="rounded-xl overflow-hidden border h-[334px] flex items-center justify-center object-cover"
                  :src="item.product.image"
                  alt="product image"
                  @error="imageHandling"
                />
              </NuxtLink>
              <div class="px-5 py-5">
                <NuxtLink :to="`/products/${item.id}`" href="#">
                  <h3
                    class="text-gray-900 font-semibold text-sm lg:text-xl tracking-tight"
                  >
                    {{ item.product.name }}
                  </h3>
                </NuxtLink>

                <div class="flex items-center justify-between mt-4">
                  <span class="text-base lg:text-3xl font-bold text-gray-900"
                    >₱{{
                      (
                        item!.product.originalPrice +
                        (item!.markupRate / 100) * item!.product!.originalPrice
                      ).toFixed(2)
                    }}</span
                  >
                  <button
                    href="#"
                    class="duration-200 transition-all text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2.5 py-1.5 lg:px-5 lg:py-2.5 text-center :bg-green-500 :ring-green-600"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p
          class="font-medium text-xl w-full text-center text-gray-500"
          v-if="skip == limit"
        >
          You have reached the query limit, you can search more using the search
          bar
        </p>
      </section>
    </main>
    <Footer />
  </div>
</template>
