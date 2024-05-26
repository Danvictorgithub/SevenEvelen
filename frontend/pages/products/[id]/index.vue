<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const { id } = useRoute().params;
const { status, token } = useAuth();
const { data: product } = await useFetch<ProductType>(`${API}/products/${id}`);
const quantity = ref(1);
function increment() {
  if (quantity.value + 1 <= product.value!.stock) {
    quantity.value++;
  }
}
function decrement() {
  if (quantity.value - 1 >= 1) {
    quantity.value--;
  }
}

async function buynow() {
  if (status.value == "unauthenticated") {
    await navigateTo("/signin");
  }
  const data = await $fetch<{ invoice_url: string }>(`${API}/xendit/buyNow`, {
    method: "POST",
    headers: {
      Authorization: token.value as string,
    },
    body: JSON.stringify({
      productId: parseInt(id as string),
      quantity: quantity.value,
    }),
  }).catch((e) => {
    const error = errorStore();
    error.value.showError = true;
    if (e.data) {
      error.value.message = e.data;
    } else if (e) {
      error.value.message = e;
    }
  });
  if (data) {
    await navigateTo(data.invoice_url, { external: true });
  }
}
const loading = loadingStore();
</script>

<template>
  <Header />

  <main class="my-8">
    <CartModal />
    <ErrorModal />
    <div class="container mx-auto px-6">
      <div
        class="md:flex md:items-center min-h-[calc(100svh-300px)] md:justify-between items-center max-w-[1000px] gap-24 mx-auto"
      >
        <div
          class="aspect-square max-w-[512px] w-full md:w-[512px] mx-auto h-full"
        >
          <img
            class="h-full w-full rounded-md object-contain max-w-lg mx-auto border flex justify-center items-center text-center"
            :src="product?.product.image"
            :alt="product?.product.name"
            @error="imageHandling"
          />
        </div>
        <div class="flex-1">
          <h3 class="text-gray-700 uppercase text-lg">
            {{ product?.product.name }}
          </h3>
          <span class="text-gray-500 mt-3"
            >₱{{ retailPrice(product as ProductType) }}</span
          >
          <hr class="my-3" />
          <div class="mt-2">
            <label class="text-gray-700 text-sm" for="count">Count:</label>
            <div class="flex items-center mt-1">
              <button
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  @click="increment"
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <span class="text-gray-700 text-lg mx-2">{{ quantity }}</span>
              <button
                @click="decrement"
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p class="text-base my-2 text-gray-700">
              {{ product?.product.productType.name }}
            </p>
          </div>
          <div class="flex items-center mt-6">
            <button
              @click="setLoading(buynow)"
              class="flex items-center gap-2 px-8 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full md:w-auto"
            >
              <Icon name="eos-icons:loading" v-if="loading.loading" />
              Buy Now
            </button>
            <button
              @click="addToCart($event, quantity, parseInt(id as string))"
              :id="id as string"
              class="mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none"
            >
              <svg
                :id="id as string"
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </button>
          </div>
          <p
            class="text-center font-bold text-3xl text-gray-500 p-4"
            v-if="product!.stock <= 0"
          >
            Sold Out
          </p>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>
