<script setup lang="ts">
await authorize();
const { token } = useAuth();
const API = useRuntimeConfig().public.API;
const { data: info } = await useFetch<UserType>(`${API}/users/info`, {
  headers: { Authorization: token.value as string },
});
</script>
<template>
  <Header />
  <main class="min-h-svh bg-white">
    <section class="bg-white dark:bg-gray-900">
      <div class="max-w-6xl px-6 py-10 mx-auto">
        <p class="text-xl font-medium text-green-500">User Profile</p>

        <h1
          class="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white"
        >
          Information
        </h1>

        <main
          class="relative z-20 w-full mt-8 md:flex md:items-center xl:mt-12"
        >
          <div
            class="absolute w-full bg-green-600 -z-10 md:h-96 rounded-2xl"
          ></div>

          <div
            class="w-full p-6 bg-green-600 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly"
          >
            <img
              class="h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-80 lg:h-[36rem] lg:w-[26rem] md:rounded-2xl"
              src="/logo.png"
              alt="client photo"
            />

            <div class="mt-2 md:mx-6">
              <div>
                <p class="text-xl font-medium tracking-tight text-white">
                  {{ `${info?.firstName} ${info?.lastName}` }}
                </p>
                <p class="text-green-200">{{ info?.status }}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  </main>
  <Footer />
</template>
