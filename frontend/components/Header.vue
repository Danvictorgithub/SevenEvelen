<script setup lang="ts">
const { status, data, signOut } = useAuth();
const showMenu = ref(false);
const showCategories = ref(false);
const API = useRuntimeConfig().public.API;
export interface Category {
  name: string;
  productTypes: Array<Category>;
}
const { data: categories } = await useFetch<Array<Category>>(`${API}/category`);
console.log(categories.value);
</script>
<template>
  <header class="border-b">
    <div
      class="p-4 md:p-0 mx-auto container flex flex-col md:flex-row items-center justify-between"
    >
      <div
        class="flex justify-center items-center rounded-xl h-14 pr-4 relative"
      >
        <img src="/logo2.png" class="h-full" alt="" />
        <div
          class="hover:text-gray-600 mainCategory h-full flex items-center justify-center"
        >
          <p
            class="font-bold mx-6 hidden items-center justify-center md:block my-auto"
          >
            categories<Icon name="ion:md-arrow-dropdown" />
          </p>
          <Category :product-types="categories as Category[]" />
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
            @click="showCategories = !showCategories"
            name="carbon:categories"
            class="hover:text-green-500 duration-100"
          />
        </div>
        <!-- <Icon
          name="material-symbols:favorite-outline-rounded"
          class="hover:text-green-500 duration-100"
        ></Icon> -->
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
        <!-- Drop Down -->
        <div
          v-else
          v-auto-animate="{ duration: 50 }"
          class="flex gap-1 items-center flex-col md:flex-row"
        >
          <Icon
            @click="showMenu = !showMenu"
            name="material-symbols:person"
            class="hover:text-green-500"
          />
          <div
            class="hidden lg:block absolute top-10 right-0 bg-white border rounded-b-xl overflow-hidden"
            v-if="showMenu"
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
    <!-- Mobile Modal Categories -->
    <div
      class="block md:hidden fixed top-0 h-full w-full duration-200"
      :class="showCategories ? 'z-10' : '-z-10'"
    >
      <div
        @click="showCategories = false"
        class="w-full h-full opacity-50 absolute -z-10"
        :class="
          (showCategories ? 'bg-gray-50' : 'bg-transparent') + ' duration-200'
        "
      ></div>
      <div
        :class="showCategories ? '' : '-translate-x-full ease-in'"
        class="w-[400px] bg-white border h-full mr-auto transition-transform duration-200 overflow-scroll no-scrollbar"
      >
        <button
          class="flex gap-2 text p-2 hover:bg-slate-100 w-full items-center"
          @click="showCategories = false"
        >
          <Icon name="material-symbols:arrow-left-alt" class="text-3xl my-6" />
          <p class="text-lg font-medium text-center">Categories</p>
        </button>

        <MobileCategory :product-types="categories" />
      </div>
    </div>
    <!-- Mobile Modal Profile -->
    <div
      class="block md:hidden fixed top-0 h-full w-full duration-200"
      :class="showMenu ? 'z-10' : '-z-10'"
    >
      <div
        @click="showMenu = false"
        class="w-full h-full opacity-50 absolute -z-10"
        :class="(showMenu ? 'bg-gray-50' : 'bg-transparent') + ' duration-200'"
      ></div>
      <div
        :class="
          showMenu ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'
        "
        class="w-[400px] bg-white border h-full ml-auto transition-transform duration-200"
      >
        <button
          class="flex gap-2 text p-2 hover:bg-slate-100 w-full items-center"
          @click="showMenu = false"
        >
          <Icon name="material-symbols:arrow-right-alt" class="text-3xl my-6" />
          <p class="text-lg font-medium"></p>
        </button>
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
          <Icon name="material-symbols-light:logout-rounded" class="text-3xl" />
          <p class="text-lg font-medium">signout</p>
        </button>
      </div>
    </div>
  </header>
</template>

<style>
.mainCategory:hover > div {
  display: block;
}
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
