<template>
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>
<script setup lang="ts">
await callOnce(getCartValue);
</script>
