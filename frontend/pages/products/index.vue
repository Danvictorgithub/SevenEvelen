<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const { data: categories } = await useFetch<Array<CategoryType>>(
  `${API}/category`
);
const showMore = ref(false);
const showFilter = ref(false);
const showGrid = ref(true);
interface productQuery {
  name: string;
  take: number;
  skip: number;
  lte: number | null;
  gte: number | null;
  orderBy: "asc" | "desc" | undefined | "undefined";
  productTypeId: number | null;
}
const query = useRoute().query;
const categoryRef = ref<BreadCrumbCategoryType | undefined>();
const computedCategory = computed(() => {
  return categoryRef.value;
});
const categoryFetchCondition = ref(query.productTypeId ? true : false);
const endFetch = ref(false);
const activeQuery = ref<productQuery | {}>(query);
const computedQuery = computed(() => {
  return { ...cleanObject(activeQuery.value) };
});
const skip = ref(query.take ? parseInt(query.take as string) : 10);
const computedQueryCount = computed(() => {
  const { orderBy, skip, take, ...mainQuery } =
    activeQuery.value as productQuery;
  return { ...cleanObject(mainQuery) };
});
const el = ref(null);
const { data: products, pending: pending1 } = await useFetch<
  Array<ProductType>
>(`${API}/products`, {
  params: computedQuery,
  lazy: true,
});
const { data: count, pending: pending2 } = await useFetch<number>(
  `${API}/products/count`,
  {
    params: computedQueryCount,
    lazy: true,
  }
);
const priceQuery = reactive({
  lte: 0,
  gte: 0,
});
async function updateBreadCrumb() {
  if (categoryFetchCondition.value && computedQuery.value.productTypeId) {
    const { data } = await useFetch<BreadCrumbCategoryType>(
      `${API}/category/${(computedQuery.value as productQuery).productTypeId}`
    );
    if (data) {
      categoryRef.value = data.value as BreadCrumbCategoryType;
    }
  } else {
    categoryRef.value = undefined;
  }
}
function categoryLink(id: number) {
  return `/products?productTypeId=${id}&take=10`;
}
onBeforeRouteUpdate(async (to, from) => {
  activeQuery.value = to.query as any;
  endFetch.value = false;
  skip.value = query.take ? parseInt(query.take as string) : 10;
  (activeQuery.value as productQuery).skip = 0;
  categoryFetchCondition.value = true;
  await updateBreadCrumb();
});
function cleanObject(obj: { [key: string]: any }) {
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined || obj[key] == "undefined" ? delete obj[key] : {}
  );
  return obj;
}
await updateBreadCrumb();
async function getMoreProducts() {
  if (endFetch.value) {
    return;
  }
  const data = await $fetch<Array<ProductType>>(`${API}/products`, {
    params: {
      ...computedQuery.value,
      skip: skip.value.toString(),
    },
  }).catch((err) => {});
  skip.value += parseInt(computedQuery.value.take);
  if (data) {
    if (data.length > 0) products.value?.push(...(data as any));
    else endFetch.value = true;
    if (skip.value - parseInt(computedQuery.value.take) === count.value) {
      endFetch.value = true;
    }
  }
}
async function updatePriceQuery() {
  const url = new URLSearchParams();
  Object.keys(cleanObject(computedQuery.value)).forEach((key) => {
    url.set(key, query[key] as string);
  });
  url.set("lte", priceQuery.lte.toString() || "0");
  url.set("gte", priceQuery.gte.toString() || "0");
  await navigateTo(`/products?${url.toString()}`);
}
watch(activeQuery, () => {
  skip.value = query.take ? parseInt(query.take as string) : 10;
  endFetch.value = false;
});
watchEffect(() => {
  console.log((activeQuery.value as productQuery).orderBy);
});

useInfiniteScroll(el, await getMoreProducts, { distance: 200 });
</script>
<template>
  <div class="h-screen overflow-scroll" ref="el">
    <Header />
    <main class="min-h-svh bg-white">
      <CartModal />
      <section class="container mx-auto my-12 flex">
        <div
          class="w-[300px] bg-white fixed lg:static h-full top-0 left-0 overflow-scroll duration-200"
          :class="showFilter ? '' : '-translate-x-full lg:translate-x-0'"
        >
          <button
            class="lg:hidden flex gap-2 text p-2 hover:bg-slate-100 w-full items-center"
            @click="showFilter = false"
          >
            <Icon
              name="material-symbols:arrow-left-alt"
              class="text-3xl my-6"
            />
            <!-- <p class="text-lg font-medium text-center">Categories</p> -->
          </button>
          <p class="font-black p-4">Categories</p>
          <div class="flex flex-col gap-2 p-4 border-b" v-auto-animate>
            <NuxtLink to="/products?take=10" class="font-bold">All</NuxtLink>
            <div v-for="category in categories">
              <NuxtLink :to="categoryLink(category.id)" class="font-bold">{{
                category.name
              }}</NuxtLink>
              <div
                class="p-2"
                v-for="subCategory in category.productTypes"
                v-if="showMore"
              >
                <NuxtLink
                  :to="categoryLink(subCategory.id)"
                  class="font-normal"
                  >{{ subCategory.name }}</NuxtLink
                >
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
                  v-model="(priceQuery as productQuery).gte"
                  min="0"
                  max="99999"
                  type="number"
                  placeholder="0"
                  class="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg px-4 focus:border-blue-400 :border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
            </div>
            <div>
              <label for="card" class="block text-sm text-gray-500 text-center"
                >Max Price</label
              >

              <div class="relative flex items-center mt-2">
                <input
                  v-model="(priceQuery as productQuery).lte"
                  type="number"
                  min="0"
                  max="99999"
                  placeholder="99999"
                  class="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg px-4 focus:border-blue-400 :border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
            </div>
          </div>
          <div class="p-4">
            <button
              @click="updatePriceQuery"
              class="font-bold text-center p-3 bg-green-500 hover:bg-green-500 text-white rounded-xl my-4 w-full"
            >
              Apply Query
            </button>
          </div>
        </div>
        <div class="flex flex-col items-start w-full">
          <!-- Mobile Query -->
          <!-- Mobile BreadCrumb -->
          <div class="block lg:hidden">
            <BreadCrumbCategory :category="computedCategory" />
          </div>
          <div class="w-full px-4 block lg:hidden mt-4">
            <div
              class="flex justify-between items-center gap-4 w-full text-xs sm:text-base"
            >
              <button
                @click="(activeQuery as productQuery).orderBy = 'undefined'"
                :class="{'bg-green-500 text-white border-transparent':(activeQuery as productQuery).orderBy == undefined}"
                class="basis-0 flex-1 font-bold rounded-xl p-4 text-black border"
              >
                Best Match
              </button>
              <button
                @click="
                  (activeQuery as productQuery).orderBy == 'undefined'
                    ? ((activeQuery as productQuery).orderBy = 'asc')
                    : (activeQuery as productQuery).orderBy == 'asc'
                    ? ((activeQuery as productQuery).orderBy = 'desc')
                    : ((activeQuery as productQuery).orderBy = 'asc')
                "
                :class="{'bg-green-500 border-transparent text-white':(activeQuery as productQuery).orderBy == 'asc' || (activeQuery as productQuery).orderBy == 'desc'}"
                class="basis-0 flex-1 font-bold rounded-xl p-4 border flex gap-4 items-center justify-center"
              >
                Price
                <Icon
                  name="teenyicons:up-solid"
                  v-if="(activeQuery as productQuery).orderBy == 'desc'"
                />
                <Icon name="teenyicons:down-solid" v-else />
              </button>
              <button
                class="basis=0 flex-1 font-bold rounded-xl p-4 border flex gap-4 items-center justify-center"
                @click="showFilter = true"
              >
                <Icon name="iconoir:filter-solid" />Filter
              </button>
            </div>
            <div class="py-2" v-if="(activeQuery as productQuery).name">
              <p class="font-bold text-xl">
                {{ (activeQuery as productQuery).name }}
              </p>
              <p class="mt-2">
                {{ count }} items found for "{{
                  (activeQuery as productQuery).name
                }}"
              </p>
            </div>
          </div>
          <!-- Desktop BreadCrumb -->
          <div class="hidden lg:block">
            <BreadCrumbCategory :category="categoryRef" />
          </div>
          <div class="items-start justify-between w-full p-4 hidden lg:flex">
            <div class="py-2" v-if="(activeQuery as productQuery).name">
              <p class="font-bold text-xl">
                {{ (activeQuery as productQuery).name }}
              </p>
              <p class="mt-2">
                {{ count }} items found for "{{
                  (activeQuery as productQuery).name
                }}"
              </p>
            </div>
            <div class="py-2" v-else>
              <p class="font-bold text-xl">All Products</p>
              <p class="mt-2">{{ count }} items</p>
            </div>
            <div class="flex items-center justify-center">
              <label class="w-24 text-sm font-medium text-gray-900"
                >Sort By:</label
              >
              <select
                v-model="(activeQuery as productQuery).orderBy"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 :ring-blue-500 :border-blue-500"
              >
                <option value="undefined">Best Match</option>
                <option value="asc">Price low to high</option>
                <option value="desc">Price high to low</option>
              </select>
              <label class="w-16 text-sm font-medium text-gray-900 ml-4"
                >view:</label
              >
              <div class="flex items-center gap-4 justify-center">
                <Icon
                  name="ion:grid"
                  :class="{ 'text-green-500': showGrid }"
                  class="cursor-pointer"
                  @click="showGrid = true"
                />
                <Icon
                  name="fa-solid:list"
                  :class="{ 'text-green-500': !showGrid }"
                  class="cursor-pointer"
                  @click="showGrid = false"
                />
              </div>
            </div>
          </div>
          <div
            v-if="showGrid"
            class="w-full grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 my-12 p-4"
          >
            <Product v-for="product in new Set(products)" :product="product" />
          </div>
          <div v-else class="w-full">
            <ProductVertical
              v-for="product in new Set(products)"
              :product="product"
            />
          </div>
          <p
            class="font-medium text-xl w-full text-center text-gray-500"
            v-if="endFetch"
          >
            You have reached the end of query
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
