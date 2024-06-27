<script setup lang="ts">
const error = errorStore();
</script>
<template>
  <UModal v-model="error.showError" class="z-[10000]">
    <div class="text-center p-4">
      <p>
        <Icon name="carbon:error-filled" class="text-7xl text-red-800" />
      </p>
      <p class="p-4 font-bold text-red-500">{{ error.message }}</p>
    </div>
  </UModal>
</template>
