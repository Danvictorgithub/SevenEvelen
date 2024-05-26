<script setup lang="ts">
const { data, token } = useAuth();
const API = useRuntimeConfig().public.API;
const { data: vendor, error } = await useFetch(`${API}/user_vendor`, {
  headers: { Authorization: token.value as string },
});
if (vendor.value) {
  await navigateTo(`/vendor`);
}
const formData = reactive<{ image: File | null; name: string }>({
  image: null,
  name: "",
});
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*", // Set to accept only image files
});
const prevImage = ref();
onChange((files) => {
  formData.image = files![0];
  prevImage.value = URL.createObjectURL(files![0]);
});

const formDataValidation = computed(() => {
  return {
    name: formData.name.length > 2,
    image: formData.image !== null,
  };
});
const loading = loadingStore();
const err = errorStore();
async function createVendorProfile() {
  if (formDataValidation.value.name && formDataValidation.value.image) {
    const fData = new FormData();
    fData.append("name", formData.name);
    fData.append("image", formData.image as any);
    const data = await $fetch(`${API}/user_vendor`, {
      method: "POST",
      headers: {
        Authorization: token.value as string,
      },
      body: fData,
    }).catch((e) => {
      err.value.showError = true;
      if (e.data) {
        err.value.message = e.data.message;
      } else if (e) {
        err.value.message = "Server is not Responding";
      }
    });
    if (data) {
      await navigateTo(`/vendor`);
    }
  } else {
    err.value.showError = true;
    err.value.message = "Please fill all the fields";
  }
}
</script>
<template>
  <Header />
  <main class="min-h-svh flex">
    <VendorSideBar />
    <section class="flex items-center justify-center flex-1 flex-col">
      <ErrorModal />
      <div>
        <label for="file" class="block text-sm text-gray-500 text-center mb-4"
          >Vendor Profile Image</label
        >

        <label
          for="dropzone-file"
          :class="{ 'border-red-400': !formDataValidation.image }"
          class="flex flex-col items-center h-[256px] w-[256px] justify-center text-center bg-white border-2 border-green-500 border-dashed cursor-pointer rounded-full"
          @click="
            {
              open() as any;
            }
          "
        >
          <div v-if="!prevImage">
            <Icon
              name="material-symbols:image-outline"
              class="text-3xl text-slate-700"
            />

            <h2 class="mt-1 font-medium tracking-wide text-gray-700">Image</h2>

            <p class="mt-2 text-xs tracking-wide text-gray-500 px-4">
              Upload or drag & drop your file SVG, PNG, JPG or GIF.
            </p>
          </div>
          <div
            v-else
            class="rounded-full flex items-center justify-center overflow-hidden"
          >
            <img :src="prevImage" alt="" class="w-full h-full object-cover" />
          </div>
        </label>
      </div>

      <div class="mt-4">
        <label
          for="username"
          class="block text-sm text-gray-500 dark:text-gray-300"
          >Vendor Name</label
        >

        <input
          v-model="formData.name"
          type="text"
          placeholder="Coca Cola Vendor"
          :class="{ 'border-red-400': !formDataValidation.name }"
          class="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-green-400 bg-white px-5 py-2.5 text-gray-700 focus:border-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-40"
        />

        <p class="mt-3 text-xs text-red-400" v-if="!formDataValidation.name">
          Name must be greater than 2
        </p>
      </div>
      <button
        @click="setLoading(createVendorProfile)"
        class="flex items-center gap-2 px-6 py-2 mt-4 font-medium tracking-wide text-white capitalize transition-colors duration-300 rounded-lg hover:bg-green-400 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
        :class="{
          'bg-gray-500': !formDataValidation.image || !formDataValidation.name,
          'bg-green-500': formDataValidation.image && formDataValidation.name,
        }"
      >
        Create Vendor Profile
        <Icon name="eos-icons:loading" v-if="loading.loading" />
      </button>
    </section>
  </main>
  <Footer />
</template>
