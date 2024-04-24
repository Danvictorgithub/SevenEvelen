<script setup lang="ts">
const { status, signIn } = useAuth();
if (status.value == "authenticated") {
  await navigateTo("/");
}
const credentials = reactive({
  email: "",
  password: "",
});
async function signin() {
  try {
    await signIn(credentials, { redirect: false });
    await navigateTo("/");
  } catch (error: any) {
    if (error.data) {
      alert("Invalid Email or Password");
    } else if (error) {
      alert("Server is not responding");
    }
  }
}
</script>
<template>
  <div class="bg-white">
    <div class="flex justify-center h-screen">
      <div
        class="hidden bg-cover lg:block lg:w-2/3"
        style="background-image: url(signin.jpg)"
      >
        <div class="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
          <div>
            <h2 class="text-2xl font-bold text-white sm:text-3xl">7 Eleven</h2>

            <p class="max-w-xl mt-3 text-gray-300">
              7-Eleven, Inc. is a convenience store chain, headquartered in
              Irving, Texas and owned by Japanese company Seven & I Holdings
              through Seven-Eleven Japan Co., Ltd. The chain was founded in 1927
              as an ice house storefront in Dallas. It was named Tote'm Stores
              between 1928 and 1946.
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div class="flex-1">
          <div class="text-center">
            <div class="flex justify-center mx-auto">
              <img class="w-auto h-10 sm:h-12" src="/logo.png" alt="" />
            </div>

            <p class="mt-3 text-gray-500">Sign in to access your account</p>
          </div>

          <div class="mt-8">
            <form>
              <div>
                <label for="email" class="block mb-2 text-sm text-gray-600"
                  >Email Address</label
                >
                <input
                  v-model="credentials.email"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@example.com"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div class="mt-6">
                <div class="flex justify-between mb-2">
                  <label for="password" class="text-sm text-gray-600"
                    >Password</label
                  >
                  <a
                    href="#"
                    class="text-sm text-gray-400 focus:text-green-500 hover:text-green-500 hover:underline"
                    >Forgot password?</a
                  >
                </div>

                <input
                  v-model="credentials.password"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Your Password"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div class="mt-6">
                <button
                  @click="signin"
                  type="button"
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none focus:bg-green-400 focus:ring focus:ring-green-300 focus:ring-opacity-50"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p class="mt-6 text-sm text-center text-gray-400">
              Don&#x27;t have an account yet?
              <NuxtLink
                to="/signup"
                class="text-green-500 focus:outline-none focus:underline hover:underline"
                >Sign up</NuxtLink
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
