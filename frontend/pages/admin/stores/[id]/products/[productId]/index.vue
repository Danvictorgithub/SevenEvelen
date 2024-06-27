<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const { id, productId } = useRoute().params;
const link = useRoute().path;
const { status, token } = useAuth();
const { data: product, error } = await useFetch<ProductType>(
  `${API}/stores/${id}/products/${productId}`,
  {
    headers: {
      Authorization: token.value as string,
    },
  }
);
if (error.value) {
  throw createError({ statusCode: 404, message: "Product not found" });
}
const showReorderProduct = ref(false);
const showDeleteProduct = ref(false);
const loading = loadingStore();
const success = successStore();
const formData = reactive({
  products: [+productId],
  quantity: 0,
});
async function reorderProduct() {
  const data = await $fetch(`${API}/reorders`, {
    method: "POST",
    headers: {
      Authorization: token.value as string,
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      success.value.showSuccess = true;
      success.value.message = "Reorder request sent";
      setTimeout(() => {
        success.value.showSuccess = false;
        showReorderProduct.value = false;
      }, 3000);
    })
    .catch((err) => {
      const e = errorStore();
      e.value.showError = true;
      if (err.data) {
        e.value.message = err.data.message;
      } else {
        e.value.message = "Server is not responding";
      }
    });
}
async function deleteProduct() {
  const data = await $fetch(`${API}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: token.value as string,
    },
  })
    .then((res) => {
      success.value.showSuccess = true;
      success.value.message = "Product deleted";
      setTimeout(async () => {
        showDeleteProduct.value = false;
        success.value.showSuccess = false;
        await navigateTo(`/admin/stores/${id}`);
      }, 3000);
    })
    .catch((err) => {
      const e = errorStore();
      e.value.showError = true;
      if (err.data) {
        e.value.message = err.data.message;
      } else {
        e.value.message = "Server is not responding";
      }
    });
}
</script>
<template>
  <div class="h-screen overflow-scroll" ref="el">
    <Header />
    <main class="min-h-svh flex">
      <AdminSideBar />
      <section class="bg-slate-100 w-full p-4">
        <div class="container px-6 py-10 mx-auto bg-white rounded-xl h-full">
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
                <div class="flex gap-2 items-center">
                  <img
                    :src="product?.product.brand.image"
                    class="h-12"
                    alt=""
                    @error="imageHandling"
                  />
                  <h4 class="text-gray-700">
                    {{ product?.product.brand.name }}
                  </h4>
                </div>
                <span class="text-gray-500 mt-3"
                  >₱{{ retailPrice(product as ProductType) }}</span
                >
                <hr class="my-3" />
                <div class="flex items-center justify-between">
                  <div class="mt-2 flex items-center">
                    <label class="text-gray-700 text-sm" for="count"
                      >Products Sold :</label
                    >
                    <div class="">
                      <span class="text-gray-700 text-lg mx-2">{{
                        product?.productsSold
                      }}</span>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center">
                    <label class="text-gray-700 text-sm" for="count"
                      >Stock:</label
                    >
                    <div class="">
                      <span class="text-gray-700 text-lg mx-2">{{
                        product?.stock
                      }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-base my-2 text-gray-700">
                    {{ product?.product.productType.name }}
                  </p>
                </div>
                <div class="flex items-center mt-6">
                  <button
                    @click="showReorderProduct = true"
                    class="flex items-center gap-2 px-8 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:bg-green-700 w-full md:w-auto"
                  >
                    <Icon name="eos-icons:loading" v-if="loading.loading" />
                    Reorder Product
                  </button>
                  <button
                    @click="showDeleteProduct = true"
                    :id="id as string"
                    class="mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none h-9 w-9 flex items-center justify-center"
                  >
                    <Icon name="mdi:trash" class="text-5xl" />
                  </button>
                  <NuxtLink :to="`${link}/edit`">
                    <button
                      :id="id as string"
                      class="mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none h-9 w-9 flex items-center justify-center"
                    >
                      <Icon name="tabler:edit" class="text-5xl" />
                    </button>
                  </NuxtLink>
                  <UModal v-model="showReorderProduct" class="z-[10000]">
                    <div class="text-center p-4">
                      <p>
                        <Icon
                          name="lets-icons:order"
                          class="text-7xl text-gray-800"
                        />
                      </p>
                      <p class="font-bold my-4">Request Product Reorder</p>
                      <div>
                        <label
                          for="quantity"
                          class="block text-sm text-gray-500"
                          >Quantity</label
                        >

                        <input
                          type="number"
                          v-model="formData.quantity"
                          placeholder="42"
                          class="block bg-gray-50 mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 px-5 py-2.5 text-gray-700 focus:border-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-40"
                        />
                      </div>

                      <button
                        @click="setLoading(reorderProduct)"
                        class="flex items-center justify-center *:gap-2 w-full mt-4 px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                      >
                        <Icon name="eos-icons:loading" v-if="loading.loading" />
                        Request Reorder
                      </button>
                    </div>
                  </UModal>
                  <UModal v-model="showDeleteProduct" class="z-[10000]">
                    <div class="text-center p-4">
                      <p>
                        <Icon
                          name="mdi:trash-outline"
                          class="text-7xl text-red-600"
                        />
                      </p>
                      <p class="font-bold my-4">
                        Are you sure to delete this product?
                      </p>

                      <button
                        @click="setLoading(deleteProduct)"
                        class="flex items-center justify-center *:gap-2 w-full mt-4 px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                      >
                        <Icon name="eos-icons:loading" v-if="loading.loading" />
                        Yes
                      </button>
                      <p class="text-sm text-gray-500 mt-4">
                        note: this will delete its external information in the
                        system including transactions
                      </p>
                    </div>
                  </UModal>
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
        </div>
      </section>
    </main>
    <Footer />
  </div>
  <ErrorModal />
  <SuccessModal />
</template>
