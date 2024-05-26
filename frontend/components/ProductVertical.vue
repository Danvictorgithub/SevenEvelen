<script setup lang="ts">
defineProps<{ product: ProductType }>();
</script>
<template>
  <div class="mt-4" :key="product.id">
    <div class="bg-white border rounded-xl flex gap-4">
      <NuxtLink
        :to="`/products/${product.id}`"
        class="flex-1 shrink-0 min-h-[174px] flex items-center justify-center max-w-[367px]"
      >
        <img
          class="rounded-xl overflow-hidden border h-auto lg:h-[334px] flex items-center justify-center object-cover w-full"
          :src="product.product.image"
          alt="product image"
          @error="imageHandling"
        />
      </NuxtLink>
      <div class="px-5 py-5 flex flex-col flex-1">
        <NuxtLink :to="`/products/${product.id}`">
          <h3
            class="text-gray-900 font-semibold text-sm lg:text-xl tracking-tight truncate"
          >
            {{ product.product.name }}
          </h3>
        </NuxtLink>
        <p class="mt-4 font-medium">
          {{ product.product.productType.name }}
        </p>
        <p class="mt-4 font-bold text-xl">
          {{ product.product.brand.name }}
        </p>
        <p class="mt-4 font-normal text-lg">
          From: {{ product.product.vendor.name }}
        </p>
        <p class="mt-4 font-normal">
          <span class="font-bold text-black">Branch:</span>
          {{ product.store.name }}
        </p>
        <div class="mt-4 flex-1 flex flex-col justify-end items-end">
          <p class="text-base lg:text-3xl font-bold text-gray-900">
            ₱{{ retailPrice(product) }}
          </p>
          <button
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
