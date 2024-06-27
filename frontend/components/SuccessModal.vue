<script setup lang="ts">
const success = successStore();
</script>
<template>
  <UModal v-model="success.showSuccess" class="z-[10000]">
    <div class="text-center p-4">
      <p>
        <Icon name="lets-icons:check-fill" class="text-7xl text-green-600" />
      </p>
      <p class="p-4 font-bold text-green-500">{{ success.message }}</p>
    </div>
  </UModal>
</template>
