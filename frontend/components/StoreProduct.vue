<script setup lang="ts">
defineProps<{ product: ProductType; showCart: boolean }>();
</script>
<template>
  <div class="max-w-2xl" :key="product.id">
    <div class="bg-white border rounded-xl max-w-sm">
      <NuxtLink
        :to="`/admin/stores/${product.store.id}/products/${product.id}`"
      >
        <img
          class="rounded-xl overflow-hidden border h-[334px] flex items-center justify-center object-cover w-full"
          :src="product.product.image"
          alt="product image"
          @error="imageHandling"
        />
      </NuxtLink>
      <div class="px-5 py-5">
        <NuxtLink
          :to="`/admin/stores/${product.store.id}/products/${product.id}`"
        >
          <h3
            class="text-gray-900 font-semibold text-sm lg:text-xl tracking-tight truncate"
          >
            {{ product.product.name }}
          </h3>
        </NuxtLink>

        <div
          class="flex flex-col lg:flex-row items-center justify-between mt-4"
        >
          <p class="text-base lg:text-3xl font-bold text-gray-900">
            ₱{{ retailPrice(product) }}
          </p>
          <button
            v-if="showCart"
            @click="addToCart"
            :id="product?.id.toString()"
            class="w-full lg:w-auto flex justify-center items-center gap-2 duration-200 transition-all text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-2.5 py-1.5 lg:px-5 lg:py-2.5 text-center :bg-green-500 :ring-green-600"
          >
            <Icon name="mdi:cart" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
