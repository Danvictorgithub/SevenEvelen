<script setup lang="ts">
const { status, data, signOut } = useAuth();
const dropDown = ref(false);
</script>
<template>
  <header class="border-b">
    <div
      class="p-4 md:p-0 mx-auto container flex flex-col md:flex-row items-center justify-between"
    >
      <div class="flex justify-center items-center rounded-xl h-14 pr-4">
        <img src="/logo2.png" class="h-full" alt="" />
        <div class="hover:text-gray-600">
          <p class="font-bold mx-6 hidden md:block">
            categories<Icon name="ion:md-arrow-dropdown" />
          </p>
        </div>
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
        <div class="block md:hidden">
          <Icon
            name="carbon:categories"
            class="hover:text-green-500 duration-100"
          />
        </div>
        <Icon
          name="material-symbols:favorite-outline-rounded"
          class="hover:text-green-500 duration-100"
        ></Icon>
        <NuxtLink to="/" class="block md:hidden">
          <Icon
            name="material-symbols:home-rounded"
            class="hover:text-green-500 duration-100"
          />
        </NuxtLink>
        <Icon
          name="material-symbols:shopping-cart-rounded"
          class="hover:text-green-500"
        ></Icon>
        <NuxtLink
          v-if="status == 'unauthenticated'"
          to="/signin"
          class="flex gap-1 items-center hover:text-green-500 flex-col md:flex-row"
        >
          <Icon name="material-symbols:person" class="hidden"></Icon>
          <p class="text-base hidden md:block">sign in</p>
        </NuxtLink>
        <div
          v-else
          v-auto-animate="{ duration: 50 }"
          class="flex gap-1 items-center flex-col md:flex-row"
        >
          <Icon
            @click="dropDown = !dropDown"
            name="material-symbols:person"
            class="hover:text-green-500"
          />
          <div
            class="hidden lg:block absolute top-10 right-0 bg-white border rounded-b-xl overflow-hidden"
            v-if="!dropDown"
          >
            <NuxtLink class="flex gap-2 text p-2 hover:bg-slate-100">
              <Icon name="material-symbols:account-circle" class="text-3xl" />
              <p class="text-lg">Profile</p>
            </NuxtLink>
            <NuxtLink class="flex gap-2 text p-2 hover:bg-slate-100">
              <Icon name="icon-park-solid:transaction-order" class="text-3xl" />
              <p class="text-lg">Transactions</p>
            </NuxtLink>
            <button
              class="flex gap-2 text p-2 hover:bg-slate-100 w-full"
              @click="signOut()"
            >
              <Icon
                name="material-symbols-light:logout-rounded"
                class="text-3xl"
              />
              <p class="text-lg font-medium">signout</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
