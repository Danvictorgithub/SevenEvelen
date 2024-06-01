<script setup lang="ts">
const API = useRuntimeConfig().public.API;
const { token } = useAuth();
await authorize();
const page = ref(1);
const computedQuery = computed(() => {
  return {
    page: page.value,
    take: 5,
  };
});
const { data: transactions } = await useFetch<{
  transactions: Array<TransactionType>;
  maxPage: number;
  transactionCount: number;
}>(`${API}/user_transactions`, {
  headers: {
    Authorization: token.value as string,
  },
  query: computedQuery,
});
</script>
<template>
  <Header />
  <main class="min-h-svh bg-white">
    <section class="container px-4 mx-auto py-12">
      <h2 class="text-lg font-medium text-gray-800 text-center">
        Transactions
      </h2>

      <p class="mt-1 text-sm text-gray-500 text-center">
        List of your purchases history
      </p>

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
                      Total Amount
                    </th>

                    <th
                      scope="col"
                      class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="transaction in transactions?.transactions">
                    <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                      <div>
                        <div
                          class="text-gray-800"
                          v-for="item in transaction.transactionItems"
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
                          v-for="(
                            item, i
                          ) in transaction.transactionItems.slice(0, 4)"
                          class="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full shrink-0"
                          :src="item.product.product.image"
                          @error="imageHandling"
                          :alt="i.toString()"
                          :key="i"
                        />

                        <p
                          v-if="transaction.transactionItems.length > 4"
                          class="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-green-600 bg-green-100 border-2 border-white rounded-full"
                        >
                          +{{ transaction.transactionItems.length - 4 }}
                        </p>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                      <div>
                        <p class="text-gray-500">
                          ₱{{ transaction.totalAmount.toFixed(2) }}
                        </p>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                      <NuxtTime
                        :datetime="transaction.createdAt"
                        month="long"
                        day="numeric"
                        year="numeric"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <UPagination
        v-model="page"
        :total="transactions?.transactionCount"
        :page-count="5"
        :max="transactions?.maxPage"
        class="mt-4"
      />
    </section>
  </main>
  <Footer />
</template>
