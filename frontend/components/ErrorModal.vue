<script setup lang="ts">
const error = errorStore();
</script>
<template>
  <UModal v-model="error.showError">
    <div class="text-center p-4">
      <p>
        <Icon name="solar:cart-outline" class="text-7xl text-slate-800" />
      </p>
      <p class="p-4 font-bold text-green-500">{{ error.message }}</p>
    </div>
  </UModal>
</template>
