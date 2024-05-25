<script setup lang="ts">
await authorize();
const { token } = useAuth();
const API = useRuntimeConfig().public.API;
const {
  data: cart,
  refresh,
  status,
} = await useFetch<Array<CartItem>>(`${API}/user_cart`, {
  headers: { Authorization: token.value as string },
});
const selectedProducts = ref<Array<number>>([]);
const errorMessage = ref("");
const error = ref(false);
const loading = ref(false);
async function decrement(e: Event) {
  const button = e.target as HTMLButtonElement;
  const id = parseInt(button.id);
  let cartItem = cart.value?.find((item) => item.id == id);
  if (cartItem!.quantity - 1 > 0) {
    --cartItem!.quantity;
    const data = await $fetch(`${API}/user_cart/${id}`, {
      method: "PATCH",
      headers: { Authorization: token.value as string },
      body: JSON.stringify({ quantity: cartItem!.quantity }),
    }).catch((e) => {
      error.value = true;
      if (e.data) {
        errorMessage.value = e.data.message;
      } else if (e) {
        errorMessage.value = "Server is not responding";
      }
    });
    cartNumber().value--;
  }
}
async function increment(e: Event) {
  const button = e.target as HTMLButtonElement;
  const id = parseInt(button.id);
  let cartItem = cart.value?.find((item) => item.id == id);
  if (cartItem!.quantity + 1 < cartItem!.product!.stock) {
    ++cartItem!.quantity;
    const data = await $fetch(`${API}/user_cart/${id}`, {
      method: "PATCH",
      headers: { Authorization: token.value as string },
      body: JSON.stringify({ quantity: cartItem!.quantity }),
    }).catch((e) => {
      error.value = true;
      if (e.data) {
        errorMessage.value = e.data.message;
      } else if (e) {
        errorMessage.value = "Server is not responding";
      }
    });
    cartNumber().value++;
  }
}

async function Delete(e: Event) {
  const button = e.target as HTMLButtonElement;
  const id = parseInt(button.id);
  let cartItemIndex = cart.value?.findIndex((item) => item.id == id);
  const data = await $fetch(`${API}/user_cart/${id}`, {
    method: "DELETE",
    headers: { Authorization: token.value as string },
  }).catch((e) => {
    error.value = true;
    if (e.data) {
      errorMessage.value = e.data.message;
    } else if (e) {
      errorMessage.value = "Server is not responding";
    }
  });
  if (data) {
    cart.value?.splice(cartItemIndex as number, 1);
  }
}

const total = computed(() => {
  if (status.value !== "success") {
    return 0;
  }
  return cart
    .value!.reduce((total, item) => {
      return selectedProducts.value.find((i) => i == item.id)
        ? (total += item.quantity * Number(retailPrice(item.product)))
        : total;
    }, 0)
    .toFixed(2);
});

async function checkout() {
  if (selectedProducts.value.length <= 0) {
    errorMessage.value = "Please select a product";
    error.value = true;
    return;
  }
  loading.value = true;
  // const products = cart.value!.map((item) => item.id);
  const data = await $fetch<{ invoice_url: string }>(`${API}/xendit/checkout`, {
    method: "POST",
    headers: { Authorization: token.value as string },
    body: JSON.stringify({ products: selectedProducts.value }),
  }).catch((e) => {
    error.value = true;
    if (e.data) {
      errorMessage.value = e.data.message;
    } else if (e) {
      errorMessage.value = "Server is not responding";
    }
  });
  if (data) {
    await navigateTo(data.invoice_url, { external: true });
  }
  loading.value = false;
}
function selectAll() {
  selectedProducts.value = cart!.value?.map((item) => item.id) as number[];
}
function removeAll() {
  selectedProducts.value = [];
}
</script>
<template>
  <Header />
  <main class="min-h-svh bg-white">
    <section class="my-12">
      <h1 class="mb-10 text-center text-2xl font-bold">Cart Items</h1>
      <div
        class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0"
      >
        <div class="rounded-lg md:w-2/3">
          <div class="flex items-center justify-between py-4">
            <button
              @click="selectAll"
              class="p-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600"
            >
              <p>Select All</p>
            </button>
            <button
              @click="removeAll"
              class="p-3 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600"
            >
              <p>Unselect All</p>
            </button>
          </div>
          <div
            class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start hover:border-green-500 border cursor-pointer"
            :class="
              selectedProducts.find((s) => s == item.id)
                ? 'border-green-600'
                : ''
            "
            v-for="item in cart"
            :key="item.id"
            @click.self="
              selectedProducts.find((s) => s == item.id)
                ? selectedProducts.splice(
                    selectedProducts.findIndex((s) => s == item.id),
                    1
                  )
                : selectedProducts.push(item.id)
            "
          >
            <NuxtLink :to="`/products/${item.product.id}`">
              <img
                :src="item.product.product.image"
                alt="product-image"
                class="w-full rounded-lg sm:w-40"
                @error="imageHandling"
              />
            </NuxtLink>
            <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
              <div
                class="mt-5 sm:mt-0 flex-1"
                @click="
                  selectedProducts.find((s) => s == item.id)
                    ? selectedProducts.splice(
                        selectedProducts.findIndex((s) => s == item.id),
                        1
                      )
                    : selectedProducts.push(item.id)
                "
              >
                <h2 class="text-lg font-bold text-gray-900">
                  {{ item.product.product.name }}
                </h2>
                <p class="mt-1 text-xs text-gray-700">
                  {{ item.product.product.size }}
                </p>
              </div>
              <div
                class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6"
              >
                <div class="flex items-center border-gray-100">
                  <button
                    @click="decrement"
                    :id="item.id.toString()"
                    class="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-red-500 hover:text-red-50"
                  >
                    -
                  </button>
                  <p class="text-sm w-8 max-w-8 text-center">
                    {{ item.quantity }}
                  </p>
                  <button
                    @click="increment"
                    :id="item.id.toString()"
                    class="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-green-500 hover:text-red-50"
                  >
                    +
                  </button>
                </div>
                <div class="flex items-center space-x-4">
                  <p class="text-sm">₱ {{ retailPrice(item.product) }}</p>
                  <button
                    @click.self="Delete"
                    :id="item.id.toString()"
                    class="p-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Sub total -->
        <div
          class="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3"
        >
          <div class="flex justify-between">
            <p class="text-lg font-bold">Total</p>
            <div class="">
              <p class="mb-1 text-lg font-bold">₱{{ total }}</p>
              <p class="text-sm text-gray-700">Free Shipping</p>
            </div>
          </div>
          <button
            @click="checkout"
            class="mt-6 w-full rounded-md bg-green-500 py-1.5 font-medium text-red-50 hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <Icon name="eos-icons:loading" v-if="loading" class="" />
            Check out
          </button>
        </div>
      </div>
    </section>
    <UModal v-model="error">
      <div class="text-center p-4">
        <p>
          <Icon
            name="material-symbols:error-outline"
            class="text-7xl text-red-600"
          />
        </p>
        <p class="p-4 font-bold text-slate-800">
          {{ errorMessage }}
        </p>
      </div>
    </UModal>
  </main>
  <Footer />
</template>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
