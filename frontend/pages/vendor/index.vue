<script setup lang="ts">
const { data, token } = useAuth();
const API = useRuntimeConfig().public.API;
const { data: vendor, error } = await useFetch<VendorType>(
  `${API}/user_vendor`,
  {
    headers: { Authorization: token.value as string },
  }
);
</script>
<template>
  <Header />
  <main class="min-h-svh flex">
    <VendorSideBar />
    <section class="" v-if="!error"></section>
    <section class="flex items-center justify-center flex-1 flex-col" v-else>
      <Icon name="ic:twotone-error" class="text-yellow-500 text-7xl" />
      <h3 class="font-bold text-slate-700 text-4xl text-center">
        No Vendor Profile Found
      </h3>
    </section>
  </main>
  <Footer />
</template>
