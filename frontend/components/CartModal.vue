<script setup lang="ts">
const successCart = cartModal();
</script>
<template>
  <UModal v-model="successCart">
    <div class="text-center p-4">
      <p>
        <Icon name="solar:cart-outline" class="text-7xl text-slate-800" />
      </p>
      <p class="p-4 font-bold text-green-500">Successfully Added to Cart</p>
    </div>
  </UModal>
</template>
