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
const loading = loadingStore();
const success = successStore();
const formData = reactive({
  markupRate: product.value?.markupRate,
});
async function updateProduct() {
  const data = await $fetch(`${API}/products/${productId}`, {
    method: "PATCH",
    headers: {
      Authorization: token.value as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      success.value.showSuccess = true;
      success.value.message = "Product updated";
      setTimeout(async () => {
        showReorderProduct.value = false;
        await navigateTo(`/admin/stores/${id}/products/${productId}`);
      }, 3000);
    })
    .catch((e) => {
      const error = errorStore();
      error.value.showError = true;
      if (e.data) {
        error.value.message = e.data.message;
      } else {
        error.value.message = "Server is not responding";
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
                <div class="flex items-center justify-between">
                  <div class="flex gap-2 items-center text-gray-500">
                    <p class="font-medium">Original Price:</p>
                    <span class=""
                      >₱{{ product?.product?.originalPrice.toFixed(2) }}</span
                    >
                  </div>
                  <div class="flex gap-2 items-center text-gray-500">
                    <p class="font-medium">Retail Price:</p>
                    <span class=""
                      >₱{{
                        (
                          (formData!.markupRate! / 100) *
                            product!.product.originalPrice +
                          product?.product!.originalPrice!
                        ).toFixed(2)
                      }}</span
                    >
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <label
                      for="quantity"
                      class="block text-sm text-gray-500 w-full"
                      >Mark-Up rate</label
                    >

                    <input
                      type="number"
                      v-model="formData.markupRate"
                      placeholder="42"
                      class="block bg-gray-50 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 p-1 text-gray-700 focus:border-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-40"
                    />
                  </div>
                </div>
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
                    @click="setLoading(updateProduct)"
                    class="flex items-center gap-2 px-8 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:bg-green-700 w-full md:w-auto"
                  >
                    <Icon name="eos-icons:loading" v-if="loading.loading" />
                    Update Product
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
        </div>
      </section>
    </main>
    <Footer />
  </div>
  <ErrorModal />
  <SuccessModal />
</template>
