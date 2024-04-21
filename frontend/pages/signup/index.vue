<script setup lang="ts">
const { status, signUp } = useAuth();
if (status.value == "authenticated") {
  await navigateTo("/");
}
const credentials = reactive({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
});
const confirmPassword = ref("");
const showPassword = ref(false);
const countDown = ref(4);
const success = ref(false);
function startCountDown() {
  success.value = true;
  let intervalId = setInterval(async () => {
    if (countDown.value > 0) {
      countDown.value--;
    } else {
      clearInterval(intervalId);
      await navigateTo("/signin");
    }
  }, 1000); // 1000ms = 1s
}
const credentialsValidate = computed(() => {
  return {
    firstName: credentials.firstName.length > 0,
    lastName: credentials.firstName.length > 0,
    phoneNumber: RegExp("\\d{10}").test(credentials.phoneNumber),
    email: RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$").test(
      credentials.email
    ),
    password: credentials.password.length >= 8,
    confirmPassword:
      confirmPassword.value === credentials.password &&
      confirmPassword.value.length >= 8,
  };
});
async function signup() {
  if (
    Object.values(credentialsValidate.value).every((value) => value === true)
  ) {
    try {
      await signUp(credentials, { redirect: false });
      startCountDown();
    } catch (e: any) {
      if (e.data) {
        alert(e.data.message);
      } else {
        alert(e);
      }
    }
  }
}
</script>
<template>
  <section class="bg-white">
    <div class="flex justify-center min-h-screen">
      <div
        class="hidden bg-cover lg:block lg:w-2/5"
        style="background-image: url(signup.jpg)"
      ></div>

      <div
        class="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5"
      >
        <div class="w-full">
          <h1
            class="text-2xl font-semibold tracking-wider text-gray-800 capitalize"
          >
            Get your free account now.
          </h1>

          <p class="mt-4 text-gray-500">
            Let’s get you all set up so you can verify your personal account and
            begin shopping.
          </p>

          <!-- <div class="mt-6">
            <h1 class="text-gray-500">Select type of account</h1>

            <div class="mt-3 md:flex md:items-center md:-mx-2">
              <button
                class="flex justify-center w-full px-6 py-3 text-white bg-green-500 rounded-lg md:w-auto md:mx-2 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <span class="mx-2"> client </span>
              </button>

              <button
                class="flex justify-center w-full px-6 py-3 mt-4 text-green-500 border border-green-500 rounded-lg md:mt-0 md:w-auto md:mx-2 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>

                <span class="mx-2"> worker </span>
              </button>
            </div>
          </div> -->

          <form class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            <div>
              <label class="block mb-2 text-sm text-gray-600">First Name</label>
              <input
                v-model="credentials.firstName"
                type="text"
                placeholder="John"
                :class="{
                  'border-red-500': !credentialsValidate.firstName,
                  'border-green-500': credentialsValidate.firstName,
                }"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 :border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600">Last name</label>
              <input
                :class="{
                  'border-red-500': !credentialsValidate.lastName,
                  'border-green-500': credentialsValidate.lastName,
                }"
                v-model="credentials.lastName"
                type="text"
                placeholder="Snow"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 :border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600"
                >Phone number</label
              >
              <input
                :class="{
                  'border-red-500': !credentialsValidate.phoneNumber,
                  'border-green-500': credentialsValidate.phoneNumber,
                }"
                v-model="credentials.phoneNumber"
                type="text"
                placeholder="09123456789"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 :border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600"
                >Email address</label
              >
              <input
                :class="{
                  'border-red-500': !credentialsValidate.email,
                  'border-green-500': credentialsValidate.email,
                }"
                v-model="credentials.email"
                type="email"
                placeholder="johnsnow@example.com"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 :border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div>
              <label class="block mb-2 text-sm text-gray-600">Password</label>
              <input
                :class="{
                  'border-red-500': !credentialsValidate.password,
                  'border-green-500': credentialsValidate.password,
                }"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 :border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div class="relative">
              <label class="block mb-2 text-sm text-gray-600"
                >Confirm password</label
              >
              <input
                :class="{
                  'border-red-500': !credentialsValidate.confirmPassword,
                  'border-green-500': credentialsValidate.confirmPassword,
                }"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-green-400 :border-green-400 focus:ring-green-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <Icon
                v-if="!showPassword"
                @click="showPassword = !showPassword"
                name="material-symbols:visibility-rounded"
                class="text-gray-500 top-[42px] right-2 absolute text-2xl"
              />
              <Icon
                v-else
                @click="showPassword = !showPassword"
                name="material-symbols:visibility-off-rounded"
                class="text-gray-500 top-[42px] right-2 absolute text-2xl"
              />
            </div>

            <button
              @click="signup"
              type="button"
              class="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-500 rounded-lg hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-50"
            >
              <span>Sign Up </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 rtl:-scale-x-100"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </form>
          <div class="p-4" v-if="success">
            <p class="text-center">
              <span class="text-green-600">Created an account.</span>
              Redirecting in {{ countDown }}
              in
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
