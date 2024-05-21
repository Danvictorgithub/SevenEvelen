<template>
  <Header />
  <div
    :class="cartOpen ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'"
    class="fixed right-0 top-0 max-w-xs w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-700">Your cart</h3>
      <button
        @click="cartOpen = !cartOpen"
        class="text-gray-600 focus:outline-none"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <hr class="my-3" />
    <div class="flex justify-between mt-6">
      <div class="flex">
        <img
          class="h-20 w-20 object-cover rounded"
          src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80"
          alt=""
        />
        <div class="mx-3">
          <h3 class="text-sm text-gray-600">Mac Book Pro</h3>
          <div class="flex items-center mt-2">
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <span class="text-gray-700 mx-2">2</span>
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <span class="text-gray-600">20$</span>
    </div>
    <div class="flex justify-between mt-6">
      <div class="flex">
        <img
          class="h-20 w-20 object-cover rounded"
          src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80"
          alt=""
        />
        <div class="mx-3">
          <h3 class="text-sm text-gray-600">Mac Book Pro</h3>
          <div class="flex items-center mt-2">
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <span class="text-gray-700 mx-2">2</span>
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <span class="text-gray-600">20$</span>
    </div>
    <div class="flex justify-between mt-6">
      <div class="flex">
        <img
          class="h-20 w-20 object-cover rounded"
          src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80"
          alt=""
        />
        <div class="mx-3">
          <h3 class="text-sm text-gray-600">Mac Book Pro</h3>
          <div class="flex items-center mt-2">
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <span class="text-gray-700 mx-2">2</span>
            <button
              class="text-gray-500 focus:outline-none focus:text-gray-600"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <span class="text-gray-600">20$</span>
    </div>
    <div class="mt-8">
      <form class="flex items-center justify-center">
        <input
          class="form-input w-48"
          type="text"
          placeholder="Add promocode"
        />
        <button
          class="ml-3 flex items-center px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
        >
          <span>Apply</span>
        </button>
      </form>
    </div>
    <a
      class="flex items-center justify-center mt-4 px-3 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
    >
      <span>Chechout</span>
      <svg
        class="h-5 w-5 mx-2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
      </svg>
    </a>
  </div>
  <main class="my-8">
    <div class="container mx-auto px-6">
      <div
        v-if="!pending"
        class="md:flex md:items-center min-h-[calc(100svh-300px)] md:justify-between items-center max-w-[1000px] gap-24 mx-auto"
      >
        <div class="aspect-square max-w-[512px] w-full md:w-[512px] mx-auto">
          <img
            class="h-full w-full rounded-md object-contain max-w-lg mx-auto border flex justify-center items-center text-center"
            :src="product?.image"
            :alt="product?.name"
          />
        </div>
        <div class="flex-1">
          <h3 class="text-gray-700 uppercase text-lg">{{ product?.name }}</h3>
          <span class="text-gray-500 mt-3">SGD {{ product?.amount }}</span>
          <hr class="my-3" />
          <div class="mt-2">
            <label class="text-gray-700 text-sm" for="count">Count:</label>
            <div class="flex items-center mt-1">
              <button
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  @click="increment"
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <span class="text-gray-700 text-lg mx-2">{{ quantity }}</span>
              <button
                @click="decrement"
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div>
            <p class="text-base my-2 text-gray-700">
              {{ product?.description }}
            </p>
          </div>
          <div class="flex items-center mt-6">
            <button
              @click="buynow"
              class="flex items-center gap-2 px-8 py-2 bg-main text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full md:w-auto"
            >
              <span
                v-if="loading"
                class="animate-spin text-sm material-symbols-outlined"
              >
                progress_activity
              </span>
              Buy Now
            </button>
            <button
              @click="addToCart"
              class="mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
        class="md:flex md:items-center min-h-[calc(100svh-300px)] justify-between items-center max-w-[1000px] gap-24 mx-auto"
      >
        <div
          class="aspect-square max-w-[512px] w-full md:w-[512px] bg-gray-300 animate-pulse rounded-xl"
        ></div>
        <div class="flex-1">
          <div class="py-2 w-32 animate-pulse bg-gray-300 my-2"></div>
          <div class="py-3 w-20 animate-pulse bg-gray-300"></div>
          <hr class="my-3" />
          <div class="mt-2">
            <label class="text-gray-700 text-sm" for="count">Count:</label>
            <div class="flex items-center mt-1">
              <button
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <div class="py-3 w-6 animate-pulse bg-gray-300 rounded-xl"></div>
              <button
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div
            class="py-2 w-full h-12 animate-pulse bg-gray-300 my-2 rounded-xl"
          ></div>
          <div class="flex items-center mt-6">
            <button
              class="px-8 py-2 bg-main text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-full md:w-auto"
            >
              Buy Now
            </button>
            <button
              class="mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="mt-16">
        <h3 class="text-gray-600 text-2xl font-medium">
          More Products from
          <span class="text-main font-bold hover:text-blue-600"
            ><NuxtLink :to="`/merchants/${product?.merchant.id}`">{{
              product?.merchant.name
            }}</NuxtLink></span
          >
        </h3>
        <div
          class="grid gap-4 grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mt-12"
          v-if="!pending"
        >
          <NuxtLink
            :to="`/products/${item.id}`"
            v-for="item in product?.merchant.products"
            class="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm h-96 item"
          >
            <div
              class="relative mx-3 mt-3 flex h-60 max-h-60 overflow-hidden rounded-xl justify-center"
            >
              <img class="object-cover" :src="item.image" alt="product image" />
            </div>
            <div class="mt-4 px-5 pb-2">
              <div>
                <h5 class="text-xl tracking-tight text-slate-900 h-10 truncate">
                  {{ item.name }}
                </h5>
              </div>
              <div class="mt-2 mb-5 flex items-center justify-between">
                <p>
                  <span class="text-xl font-bold text-main"
                    >SGD {{ item.amount }}</span
                  >
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="grid grid-cols-5 w-full gap-4 py-12">
          <div
            v-for="i in 5"
            class="bg-slate-300 rounded-lg animate-pulse aspect-square"
          ></div>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>
