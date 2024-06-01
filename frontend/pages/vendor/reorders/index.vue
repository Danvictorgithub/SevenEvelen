<script setup lang="ts">
const { data, token } = useAuth();
const API = useRuntimeConfig().public.API;
const page = ref(1);
const query = computed(() => ({
  take: 5,
  skip: (page.value - 1) * 5,
  orderBy: "asc",
}));
const { data: reorders, refresh } = await useFetch<reorderType[]>(
  `${API}/user_vendor/reorders`,
  {
    headers: {
      Authorization: token.value as string,
    },
    watch: [page],
    query,
  }
);
const { data: count, refresh: refreshCount } = await useFetch<string>(
  `${API}/user_vendor/reorders/count`,
  {
    headers: {
      Authorization: token.value as string,
    },
    watch: [page],
  }
);
const err = errorStore();
const loading = loadingStore();
const selectedId = ref();
const showSuccessModal = ref(false);
const showRejectModal = ref(false);
const successModalMessage = ref("");
const showApproveModal = ref(false);
const deliveryDate = ref<Date>(new Date());
function approveButton(id: string) {
  selectedId.value = id;
  showApproveModal.value = true;
}
async function approveReorder() {
  const data = await $fetch(`${API}/user_vendor/reorders/${selectedId.value}`, {
    method: "PATCH",
    headers: {
      Authorization: token.value as string,
    },
    body: JSON.stringify({
      status: "Approved",
      deliveryDate: new Date(deliveryDate.value as Date),
    }),
  }).catch((e) => {
    err.value.showError = true;
    if (e.data) {
      if (e.data.statusCode == 400) {
        err.value.message = e.data.message;
        return;
      }
      const msgArray = e.data.message as string[];
      err.value.message = msgArray.flat().join(", ");
    } else if (e) {
      err.value.message = "Server is not responding";
    }
  });
  if (data) {
    showSuccessModal.value = true;
    successModalMessage.value = "Reorder has been approved successfully";
    showApproveModal.value = false;
    deliveryDate.value = new Date();
    await refresh();
    await refreshCount();
  }
}
function rejectButton(id: string) {
  selectedId.value = id;
  showRejectModal.value = true;
}
async function rejectReorder() {
  const data = await $fetch(`${API}/user_vendor/reorders/${selectedId.value}`, {
    method: "PATCH",
    headers: {
      Authorization: token.value as string,
    },
    body: JSON.stringify({
      status: "Rejected",
    }),
  }).catch((e) => {
    err.value.showError = true;
    if (e.data) {
      if (e.data.statusCode == 400) {
        err.value.message = e.data.message;
        return;
      }
      const msgArray = e.data.message as string[];
      err.value.message = msgArray.flat().join(", ");
    } else if (e) {
      err.value.message = "Server is not responding";
    }
  });
  if (data) {
    showSuccessModal.value = true;
    successModalMessage.value = "Reorder has been rejected successfully";
    showApproveModal.value = false;
    deliveryDate.value = new Date();
    await refresh();
    await refreshCount();
  }
}
</script>
<template>
  <Header />
  <main class="min-h-svh flex">
    <ErrorModal />
    <UModal v-model="showSuccessModal">
      <div class="text-center p-4">
        <p>
          <Icon name="lets-icons:check-fill" class="text-7xl text-green-800" />
        </p>
        <p class="p-4 font-bold text-green-500">
          {{ successModalMessage }}
        </p>
      </div>
    </UModal>
    <UModal v-model="showApproveModal">
      <div class="text-center p-4">
        <h2 class="p-4 font-bold text-slate-800 text-lg">Set Delivery Date</h2>
        <label class="font-medium">Delivery Date: </label>
        <input type="date" v-model="deliveryDate" class="p-2 border mb-4" />
        <button
          type="button"
          @click="setLoading(approveReorder)"
          class="bg-green-500 flex items-center gap-2 w-full mb-4 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          <Icon name="eos-icons:loading" v-if="loading.loading" />
          Approve Reorder
        </button>
      </div>
    </UModal>
    <UModal v-model="showRejectModal">
      <div class="text-center p-4">
        <h2 class="p-4 font-bold text-red-500 text-lg">
          Are you sure to reject the reorder?
        </h2>
        <button
          type="button"
          @click="setLoading(rejectReorder)"
          class="bg-green-500 flex items-center gap-2 w-full mb-4 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          <Icon name="eos-icons:loading" v-if="loading.loading" />
          Reject Reorder
        </button>
      </div>
    </UModal>
    <VendorSideBar />
    <section class="p-4 flex-1 min-h-screen container mx-auto my-12">
      <section class="container mx-auto">
        <div class="flex items-center justify-between flex-col lg:flex-row">
          <div class="flex items-center gap-x-3">
            <h2 class="text-lg font-medium text-gray-800">Reorder reorders</h2>

            <span
              class="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full"
              >{{ count }} reorders</span
            >
          </div>
        </div>

        <div class="flex flex-col mt-6 px-4">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
            >
              <div class="overflow-hidden border border-gray-200 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <button
                          class="flex items-center gap-x-3 focus:outline-none"
                        >
                          <span>Products</span>

                          <svg
                            class="h-3"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                              fill="currentColor"
                              stroke="currentColor"
                              stroke-width="0.1"
                            />
                            <path
                              d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                              fill="currentColor"
                              stroke="currentColor"
                              stroke-width="0.1"
                            />
                            <path
                              d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                              fill="currentColor"
                              stroke="currentColor"
                              stroke-width="0.3"
                            />
                          </svg>
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Images
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Request Date
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Delivery Date
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="reorder in reorders">
                      <td
                        class="px-4 py-4 text-sm font-medium whitespace-nowrap"
                      >
                        <div>
                          <div
                            class="text-gray-800"
                            v-for="item in reorder.reorderItems"
                          >
                            <NuxtLink
                              :to="`/products/${item.product.id}`"
                              class="font-medium"
                            >
                              {{ item.product.product.name }}
                              <span class="font-normal"
                                >x {{ item.quantity }}</span
                              >
                            </NuxtLink>
                          </div>
                        </div>
                      </td>

                      <td
                        class="px-12 py-4 text-sm font-medium whitespace-nowrap"
                      >
                        <div class="flex items-center">
                          <img
                            v-for="(item, i) in reorder.reorderItems.slice(
                              0,
                              4
                            )"
                            class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full shrink-0"
                            :src="item.product.product.image"
                            @error="imageHandling"
                            :alt="i.toString()"
                            :key="i"
                          />

                          <p
                            v-if="reorder.reorderItems.length > 4"
                            class="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-green-600 bg-green-100 border-2 border-white rounded-full"
                          >
                            +{{ reorder.reorderItems.length - 4 }}
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <p
                          :class="{
                            'text-green-500': reorder.status == 'Approved',
                            'text-yellow-500': reorder.status == 'Delivered',
                            'text-red-500': reorder.status == 'Rejected',
                            'text-gray-500': reorder.status == 'Pending',
                          }"
                        >
                          {{ reorder.status }}
                        </p>
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <p class="text-gray-500">
                            {{
                              reorder.reorderItems.reduce(
                                (acc, sum) => acc + sum.quantity,
                                0
                              )
                            }}
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <NuxtTime
                          :datetime="reorder.createdAt"
                          month="long"
                          day="numeric"
                          year="numeric"
                        />
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <NuxtTime
                          v-if="reorder.deliveryDate"
                          :datetime="reorder.deliveryDate"
                          month="long"
                          day="numeric"
                          year="numeric"
                        />
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div
                          class="flex items-center gap-x-6"
                          v-if="reorder.status == 'Pending'"
                        >
                          <button
                            @click="rejectButton(reorder.id)"
                            class="transition-colors duration-200 hover:bg-white hover:text-red-500 focus:outline-none border p-4 rounded bg-red-500 border-red-500 text-white"
                          >
                            <Icon name="dashicons:no" />
                          </button>

                          <button
                            @click="approveButton(reorder.id)"
                            class="transition-colors duration-200 hover:bg-white hover:text-green-500 focus:outline-none border p-4 rounded bg-green-500 border-green-500 text-white"
                          >
                            <Icon name="mdi:check-bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="flex items-center">
        <UPagination
          v-model="page"
          :total="parseInt(count as string)"
          :page-count="query.take"
          class="mt-4 mx-auto"
        />
      </div>
    </section>
  </main>
  <Footer />
</template>
