<script setup lang="ts">
await authorize("Vendor");
const { data, token } = useAuth();
const API = useRuntimeConfig().public.API;
const { data: vendor, error } = await useFetch<VendorType>(
  `${API}/user_vendor`,
  {
    headers: { Authorization: token.value as string },
  }
);
const showSideBar = ref(true);
const userData = data as unknown as UserAuth;
</script>
<template>
  <aside
    class="flex flex-col w-64 max-w-64 h-screen px-4 py-8 bg-white border-r rtl:border-r-0 rtl:border-l flex-1 fixed lg:static duration-200 top-0"
    :class="{ '-translate-x-full': !showSideBar }"
  >
    <h2 class="text-center font-bold text-xl text-slate-700">
      Vendor Dashboard
    </h2>
    <button
      @click="showSideBar = !showSideBar"
      class="absolute top-1/2 -right-8 bg-white rounded-full aspect-square p-4 block lg:hidden z-50 border-r-2"
      :class="{
        '-right-10': !showSideBar,
      }"
    >
      <Icon
        name="material-symbols:arrow-right-alt"
        class="text-3xl"
        v-if="!showSideBar"
      />
      <Icon name="material-symbols:arrow-left-alt" class="text-3xl" v-else />
    </button>
    <div class="flex flex-col items-center mt-6 -mx-2" v-if="!error">
      <img
        class="object-cover w-24 h-24 mx-2 rounded-full border"
        :src="vendor?.image"
        @error="imageHandling"
        alt="avatar"
      />

      <h4 class="mx-2 mt-2 font-medium text-gray-800">{{ vendor?.name }}</h4>
      <p class="mx-2 mt-1 text-sm font-medium text-gray-600">
        {{ userData.email }}
      </p>
    </div>
    <div class="flex flex-col items-center mt-6 -mx-2" v-else>
      <Icon
        name="iconamoon:profile-circle-fill"
        class="object-cover w-24 h-24 mx-2 rounded-full text-slate-600"
      />
      <h4 class="mx-2 mt-2 font-medium text-gray-800">Create Vendor Profile</h4>

      <NuxtLink
        to="/vendor/create"
        class="px-6 py-2 mt-4 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
      >
        Create
      </NuxtLink>
    </div>
    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav v-if="!error">
        <a
          class="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
          href="#"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span class="mx-4 font-medium">Dashboard</span>
        </a>

        <a
          class="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 :bg-gray-800 :text-gray-200 hover:text-gray-700"
          href="#"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span class="mx-4 font-medium">Accounts</span>
        </a>

        <a
          class="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 :bg-gray-800 :text-gray-200 hover:text-gray-700"
          href="#"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span class="mx-4 font-medium">Tickets</span>
        </a>

        <a
          class="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 :bg-gray-800 :text-gray-200 hover:text-gray-700"
          href="#"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span class="mx-4 font-medium">Settings</span>
        </a>
      </nav>
    </div>
  </aside>
</template>
