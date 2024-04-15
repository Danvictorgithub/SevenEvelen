<script setup lang="ts">
const { status } = useAuth();
</script>
<template>
  <header class="border-b">
    <div
      class="p-4 md:p-0 mx-auto container flex flex-col md:flex-row items-center justify-between"
    >
      <div class="flex justify-center items-center rounded-xl h-14 pr-4">
        <img src="/logo2.png" class="h-full" alt="" />
      </div>
      <div class="relative text-gray-600 flex-1 w-full">
        <input
          class="w-full border bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
          type="search"
          name="search"
          placeholder="Search Products"
        />
        <button
          type="submit"
          class="absolute right-2 h-full hover:text-green-500"
        >
          <Icon name="material-symbols:search-rounded" class="text-2xl" />
        </button>
      </div>
      <div
        class="flex gap-4 items-center text-2xl px-4 fixed md:static bottom-0 md:bottom-auto bg-white md:w-auto left-[5%] md:left-auto justify-between md:justify-normal p-4 border rounded-t-xl md:border-0 w-[90%]"
      >
        <Icon
          name="material-symbols:favorite-outline-rounded"
          class="hover:text-green-500 duration-100"
        ></Icon>
        <Icon
          name="material-symbols:shopping-cart-rounded"
          class="hover:text-green-500"
        ></Icon>
        <NuxtLink
          to="/signin"
          class="flex gap-1 items-center hover:text-green-500 flex-col md:flex-row"
        >
          <Icon name="material-symbols:person" class="hidden"></Icon>
          <p class="text-base hidden md:block">sign in</p>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
