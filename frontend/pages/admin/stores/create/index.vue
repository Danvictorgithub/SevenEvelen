<script setup lang="ts">
const formData = reactive<{
  name: string;
  image: null | File;
  lat: string;
  long: string;
  address: string;
  opening_hours: string;
}>({
  name: "",
  address: "",
  image: null,
  lat: "",
  long: "",
  opening_hours: "24/7",
});
const prevImage = ref(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/2110px-7-eleven_logo.svg.png"
);
const locationSelected = ref<any>(null);
const address = ref("");
const loading = loadingStore();
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*", // Set to accept only image files
});
onChange((files) => {
  formData.image = files![0];
  prevImage.value = URL.createObjectURL(files![0]);
});

async function reverseGeoLocation() {
  interface Result {
    display_name: string;
    lat: string;
    lon: string;
    error: string;
  }
  if (locationSelected.value) {
    clearAddress();
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationSelected.value.lat}&lon=${locationSelected.value.lng}&zoom=18&addressdetails=0`;
    const data = await $fetch<Result>(url).catch((e) => {
      const err = errorStore();
      err.value.showError = true;
      if (e.data) {
        err.value.message = e.data.message;
      } else {
        err.value.message = "No data available";
      }
    });
    if ((data as Result).error) {
      const err = errorStore();
      err.value.showError = true;
      err.value.message = (data as Result).error;
    } else {
      address.value = (data as Result).display_name;
      formData.address = address.value;
      formData.long = (data as Result).lon;
      formData.lat = (data as Result).lat;
    }
  }
}

function clearAddress() {
  formData.address = "";
  formData.long = "";
  formData.lat = "";
}
async function getInfo(e: { latlng: { lat: number; long: number } }) {
  locationSelected.value = e.latlng;
  await setLoading(reverseGeoLocation, 0);
}

const formValidation = computed(() => {
  return {
    name: formData.name ? true : false,
    lat: formData.lat ? true : false,
    long: formData.long ? true : false,
    address: formData.address ? true : false,
    opening_hours: formData.opening_hours ? true : false,
  };
});
const formValidated = computed(() =>
  Object.values(formValidation.value).every((val) => val == true)
);

async function createStore() {
  if (formValidated.value) {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("image", formData.image as Blob);
    form.append("lat", formData.lat);
    form.append("long", formData.long);
    form.append("address", formData.address);
    form.append("opening_hours", formData.opening_hours);
    const { token } = useAuth();
    const API = useRuntimeConfig().public.API;
    await $fetch<{ id: number }>(`${API}/stores`, {
      method: "POST",
      headers: {
        Authorization: token.value as string,
      },
      body: form,
    })
      .then(async (data) => {
        if (data) {
          const success = successStore();
          success.value.showSuccess = true;
          success.value.message = "Store created successfully, redirecting...";
          let countDown = 0;
          let interval = setInterval(async () => {
            countDown++;
            if (countDown == 3) {
              clearInterval(interval);
              success.value.showSuccess = false;
              await navigateTo(`/admin/stores/${data.id}`);
            }
          }, 1000);
        }
      })
      .catch((e) => {
        const err = errorStore();
        err.value.showError = true;
        if (e.data) {
          err.value.message = e.data.message;
        } else {
          err.value.message = "Server is not responding";
        }
      });
  }
}
</script>
<template>
  <Header />
  <main class="min-h-[calc(100svh-65px)] flex">
    <AdminSideBar />
    <section class="bg-slate-100 w-full p-4">
      <div
        class="min-h-full container px-6 py-10 mx-auto bg-white rounded-xl mb-24"
      >
        <section class="h-full">
          <p class="text-center font-bold text-xl p-4 border-b">Create Store</p>
          <form class="h-full">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full my-12">
              <div>
                <div class="flex flex-col justify-center items-center">
                  <label
                    for="file"
                    class="block text-sm text-gray-500 text-center mb-4"
                    >Store Image</label
                  >

                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center h-[256px] w-[256px] justify-center text-center bg-white border-2 border-green-500 border-dashed cursor-pointer rounded-xl"
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

                      <h2 class="mt-1 font-medium tracking-wide text-gray-700">
                        Image
                      </h2>

                      <p class="mt-2 text-xs tracking-wide text-gray-700 px-4">
                        Upload your file SVG, PNG, JPG or GIF.
                      </p>
                    </div>
                    <div
                      v-else
                      class="rounded-xl flex items-center justify-center overflow-hidden"
                    >
                      <img
                        :src="prevImage"
                        alt=""
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </label>
                </div>
                <div class="mt-12">
                  <label class="text-gray-700" for="name">Store Name</label>
                  <input
                    id="name"
                    type="text"
                    v-model="formData.name"
                    :class="{ 'border-red-500': !formValidation.name }"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
                  />
                </div>

                <!-- <div>
                <label class="text-gray-700" for="address">Address</label>
                <input
                  id="address"
                  type="email"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
                />
              </div> -->

                <div>
                  <label class="text-gray-700" for="opening_hours"
                    >Opening Hours</label
                  >
                  <input
                    id="opening_hours"
                    type="opening_hours"
                    v-model="formData.opening_hours"
                    :class="{ 'border-red-500': !formValidation.opening_hours }"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
                  />
                </div>
              </div>
              <div>
                <div
                  :class="{
                    'border-red-500':
                      !formValidation.lat &&
                      !formValidation.long &&
                      !formValidation.address,
                  }"
                  class="h-full w-full min-h-96 max-h-[700px] p-2 border border-green-500 rounded-xl"
                >
                  <LMap
                    ref="map"
                    :zoom="5.3"
                    :center="[12.8797, 121.774]"
                    @click="getInfo"
                  >
                    <LTileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                      layer-type="base"
                      name="OpenStreetMap"
                    />
                    <LMarker
                      :lat-lng="locationSelected"
                      v-if="locationSelected"
                    >
                      <LPopup class="w-full">
                        {{ !loading.loading ? address : "Loading" }}</LPopup
                      >
                    </LMarker>
                  </LMap>
                </div>
                <div class="mt-2">
                  <label class="text-gray-700" for="address"
                    >Address:
                    <span class="font-medium">{{
                      !loading.loading ? address : "Loading"
                    }}</span></label
                  >
                </div>
                <div class="flex justify-end mt-6">
                  <button
                    @click="setLoading(createStore, 1)"
                    :class="{
                      'bg-gray-300 hover:bg-gray-600 focus:bg-gray-600 ':
                        !formValidated,
                    }"
                    type="button"
                    class="flex items-center gap-2 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                  >
                    <Icon
                      name="line-md:loading-twotone-loop"
                      v-if="loading.loading && loading.id == 1"
                    />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </section>
  </main>
  <Footer />
  <ErrorModal />
  <SuccessModal />
</template>
