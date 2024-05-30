<script setup lang="ts">
const { data, token } = useAuth();
const API = useRuntimeConfig().public.API;
const page = ref(1);
const name = ref("");
const query = computed(() => {
  return {
    take: 10,
    skip: (page.value - 1) * 10,
    name: name.value,
  };
});
const activeQuery = computed(() => {
  return { ...query.value };
});
const {
  data: products,
  error,
  refresh,
} = await useFetch<Array<VendorProductType>>(`${API}/user_vendor/products`, {
  headers: { Authorization: token.value as string },
  query: activeQuery,
});
const { data: count, refresh: refresh1 } = await useFetch<string>(
  `${API}/user_vendor/products/count`,
  {
    headers: { Authorization: token.value as string },
    query: activeQuery,
  }
);
const { data: categories } = await useFetch<Array<CategoryType[]>>(
  `${API}/category/all`
);
const { data: brands } = await useFetch<BrandType[]>(`${API}/brands`);
watch(name, () => {
  page.value = 1;
});
watch(page, () => {
  selectedItems.value = [];
});
function selectAll() {
  if (selectedItems.value.length == products?.value!.length) {
    selectedItems.value = [];
  } else {
    selectedItems.value = products?.value!.map(
      (product) => product.id
    ) as Array<number>;
  }
}
const selectedItems = ref<Array<number>>([]);
const showCreateModal = ref(false);
const formData = reactive<{
  name: string;
  image: File | null;
  upcCode: string;
  size: string;
  originalPrice: number;
  brand: BrandType | null;
  productType: CategoryType | null;
}>({
  name: "",
  image: null,
  upcCode: "",
  size: "1 g",
  originalPrice: NaN,
  brand: null,
  productType: null,
});
const prevImage = ref();
const { files, open, reset, onChange } = useFileDialog({
  accept: "image/*", // Set to accept only image files
});
onChange((files) => {
  formData.image = files![0];
  prevImage.value = URL.createObjectURL(files![0]);
});
const formDataValidation = computed(() => ({
  name: formData.name.length > 2,
  image: formData.image !== null,
  upcCode: formData.upcCode.toString().length == 12,
  size: formData.size.length > 2,
  originalPrice: formData.originalPrice > 0,
  brand: formData.brand !== null,
  productType: formData.productType !== null,
}));

const loading = loadingStore();
const err = errorStore();
const successModal = ref(false);
const successModalMessage = ref("");
function clearFormData() {
  formData.name = "";
  formData.image = null;
  formData.upcCode = "";
  formData.size = "1 g";
  formData.originalPrice = NaN;
  formData.brand = null;
  formData.productType = null;
  prevImage.value = null;
}
async function createProduct() {
  if (
    Object.entries(formDataValidation.value)
      .map(([key, value]) => {
        return value;
      })
      .includes(false)
  ) {
    return;
  }
  const fData = new FormData();
  fData.append("name", formData.name);
  fData.append("image", formData.image as Blob);
  fData.append("upcCode", formData.upcCode.toString());
  fData.append("size", formData.size);
  fData.append("originalPrice", formData.originalPrice.toString());
  fData.append("brandId", formData.brand!.id.toString());
  fData.append("productTypeId", formData.productType!.id.toString());

  const data = await $fetch(`${API}/user_vendor/products`, {
    method: "POST",
    headers: { Authorization: token.value as string },
    body: fData,
  }).catch((e) => {
    err.value.showError = true;
    if (e.data) {
      err.value.message = e.data.message;
    } else if (e) {
      err.value.message = "Server is not responding";
    }
  });
  showCreateModal.value = false;
  if (data) {
    successModal.value = true;
    successModalMessage.value = "Successfully created Product";
    clearFormData();
    await refresh();
    await refresh1();
  }
}

const showEditModal = ref(false);
const editProductDetails = ref<VendorProductType | null>(null);
function editButton(id: number) {
  selectedId.value = id;
  showEditModal.value = true;
  const product = products.value?.find((product) => product.id == id);
  editProductDetails.value = product as VendorProductType;
  clearFormData();
  formData.size = "";
  //   if (product) {
  //     formData.name = product.name;
  //     formData.upcCode = product.upcCode;
  //     formData.size = product.size;
  //     formData.originalPrice = product.originalPrice;
  //     formData.brand = product.brand;
  //     formData.productType = product.productType;
  //     formData.image = null;
  //     prevImage.value = product.image;
  //   }
}
async function editProduct() {
  const fData = new FormData();
  const { brand, image, productType, ...mainForm } = formData;
  Object.entries(mainForm).map(([key, value]) => {
    if (value) {
      fData.append(key, value.toString());
    }
  });
  if (brand) {
    fData.append("brandId", brand.id.toString());
  }
  if (productType) {
    fData.append("productTypeId", productType.id.toString());
  }
  if (image) {
    fData.append("image", image as Blob);
  }
  //   fData.append("name", formData.name);
  //   fData.append("image", formData.image as Blob);
  //   fData.append("upcCode", formData.upcCode.toString());
  //   fData.append("size", formData.size);
  //   fData.append("originalPrice", formData.originalPrice.toString());
  //   fData.append("brandId", formData.brand!.id.toString());
  //   fData.append("productTypeId", formData.productType!.id.toString());
  const data = await $fetch(`${API}/user_vendor/products/${selectedId.value}`, {
    method: "PATCH",
    headers: { Authorization: token.value as string },
    body: fData,
  }).catch((e) => {
    err.value.showError = true;
    if (e.data) {
      err.value.message = e.data.message;
    } else if (e) {
      err.value.message = "Server is not responding";
    }
  });
  if (data) {
    showEditModal.value = false;
    successModal.value = true;
    successModalMessage.value = "Successfully updated Product";
    clearFormData();

    await refresh();
    await refresh1();
  }
}
async function deleteProduct() {
  const data = await $fetch(`${API}/user_vendor/products/${selectedId.value}`, {
    method: "DELETE",
    headers: { Authorization: token.value as string },
  }).catch((e) => {
    err.value.showError = true;
    if (e.data) {
      err.value.message = e.data.message;
    } else if (e) {
      err.value.message = "Server is not responding";
    }
  });
  if (data) {
    showDeleteModal.value = false;
    successModal.value = true;
    successModalMessage.value = "Successfully deleted Product";
    page.value = 1;
    await refresh();
    await refresh1();
  }
}
async function deleteAllProduct() {
  const data = await $fetch(`${API}/user_vendor/products`, {
    method: "DELETE",
    headers: { Authorization: token.value as string },
    body: JSON.stringify({ products: selectedItems.value }),
  }).catch((e) => {
    err.value.showError = true;
    if (e.data) {
      err.value.message = e.data.message;
    } else if (e) {
      err.value.message = "Server is not responding";
    }
  });
  if (data) {
    showDeleteAllModal.value = false;
    successModal.value = true;
    successModalMessage.value = "Successfully deleted Products";
    page.value = 1;
    await refresh();
    await refresh1();
  }
}
function buttonDelAll() {
  if (selectedItems.value.length == 0) {
    err.value.showError = true;
    err.value.message = "No product selected to delete";
    return;
  }
  showDeleteAllModal.value = true;
}
async function buttonDel(id: number) {
  selectedId.value = id;
  showDeleteModal.value = true;
}
const showDeleteModal = ref(false);
const showDeleteAllModal = ref(false);
const selectedId = ref<number>(NaN);
</script>
<template>
  <Header />
  <main class="min-h-svh flex">
    <ErrorModal />
    <UModal v-model="showDeleteModal">
      <div class="text-center p-4">
        <p class="p-4 font-bold text-red-500">
          Are you sure you want to delete this product?
        </p>
        <button
          type="button"
          @click="setLoading(deleteProduct)"
          class="bg-green-500 flex items-center gap-2 w-full mb-4 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          <Icon name="eos-icons:loading" v-if="loading.loading" />
          Delete Product
        </button>
      </div>
    </UModal>
    <UModal v-model="showDeleteAllModal">
      <div class="text-center p-4">
        <p class="p-4 font-bold text-red-500">
          Are you sure you want to delete selected products?
        </p>
        <button
          type="button"
          @click="setLoading(deleteAllProduct)"
          class="bg-green-500 flex items-center gap-2 w-full mb-4 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          <Icon name="eos-icons:loading" v-if="loading.loading" />
          Delete Products
        </button>
      </div>
    </UModal>
    <UModal v-model="successModal">
      <div class="text-center p-4">
        <p>
          <Icon name="lets-icons:check-fill" class="text-7xl text-green-800" />
        </p>
        <p class="p-4 font-bold text-green-500">
          {{ successModalMessage }}
        </p>
      </div>
    </UModal>
    <UModal v-model="showCreateModal" :ui="{ container: 'items-center' }">
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-700 capitalize mt-4">
            Create Vendor Product
          </h2>
        </div>

        <form>
          <div class="my-12 flex flex-col gap-4">
            <div class="flex flex-col justify-center items-center">
              <label
                for="file"
                class="block text-sm text-gray-500 text-center mb-4"
                >Product Image</label
              >

              <label
                for="dropzone-file"
                :class="{ 'border-red-400': !formDataValidation.image }"
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

                  <p class="mt-2 text-xs tracking-wide text-gray-500 px-4">
                    Upload your file SVG, PNG, JPG or GIF.
                  </p>
                </div>
                <div
                  v-else
                  class="rounded-full flex items-center justify-center overflow-hidden"
                >
                  <img
                    :src="prevImage"
                    alt=""
                    class="w-full h-full object-cover"
                  />
                </div>
              </label>
            </div>
            <div>
              <label class="text-gray-700" for="username">Name</label>
              <input
                v-model="formData.name"
                :class="{ 'border-red-400': !formDataValidation.name }"
                id="username"
                type="text"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md border-green-500"
              />
            </div>
            <div>
              <label class="text-gray-700" for="emailAddress">Brand</label>
              <UInputMenu
                variant="none"
                v-model="formData.brand"
                :options="brands"
                placeholder="Select a Category"
                by="id"
                option-attribute="name"
                :search-attributes="['name']"
                class="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
                :class="{ 'border-red-500': !formDataValidation.brand }"
              >
                <template #option="{ option: brand }">
                  <span><img class="h-4 w-4" :src="brand.image" alt="" /></span>
                  <span class="truncate">{{ brand.name }}</span>
                </template>
              </UInputMenu>
            </div>
            <div>
              <label class="text-gray-700" for="emailAddress">Category</label>
              <UInputMenu
                variant="none"
                v-model="formData.productType"
                :options="categories"
                placeholder="Select a Category"
                by="id"
                option-attribute="name"
                :search-attributes="['name']"
                class="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
                :class="{ 'border-red-500': !formDataValidation.productType }"
              >
                <template #option="{ option: category }">
                  <span class="truncate">{{ category.name }}</span>
                </template>
              </UInputMenu>
            </div>

            <div>
              <label class="text-gray-700" for="password">Size</label>
              <input
                v-model="formData.size"
                id="size"
                type="text"
                :class="{ 'border-red-500': !formDataValidation.size }"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              />
            </div>

            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >UPC Code</label
              >
              <input
                v-model="formData.upcCode"
                id="passwordConfirmation"
                type="number"
                :class="{ 'border-red-500': !formDataValidation.upcCode }"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              />
            </div>
            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >Price</label
              >
              <input
                v-model="formData.originalPrice"
                id="passwordConfirmation"
                type="number"
                :class="{ 'border-red-500': !formDataValidation.originalPrice }"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              type="button"
              @click="setLoading(createProduct)"
              :class="{
                'bg-gray-500':
                  Object.values(formDataValidation).includes(false),
                'bg-green-500':
                  !Object.values(formDataValidation).includes(false),
              }"
              class="flex items-center gap-2 w-full mb-4 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              <Icon name="eos-icons:loading" v-if="loading.loading" />
              Create Product
            </button>
          </div>
        </form>
      </div>
    </UModal>
    <UModal v-model="showEditModal" :ui="{ container: 'items-center' }">
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-700 capitalize mt-4">
            Edit Vendor Product
          </h2>
        </div>

        <form>
          <div class="my-12 flex flex-col gap-4">
            <div class="flex flex-col justify-center items-center">
              <label
                for="file"
                class="block text-sm text-gray-500 text-center mb-4"
                >Product Image</label
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
                <div
                  v-if="!prevImage"
                  class="rounded-full flex items-center justify-center overflow-hidden"
                >
                  <img
                    :src="editProductDetails?.image"
                    alt=""
                    class="w-full h-full object-cover"
                  />
                </div>
                <div
                  v-else
                  class="rounded-full flex items-center justify-center overflow-hidden"
                >
                  <img
                    :src="prevImage"
                    alt=""
                    class="w-full h-full object-cover"
                  />
                </div>
              </label>
            </div>
            <div>
              <label class="text-gray-700" for="username">Name</label>
              <input
                v-model="formData.name"
                id="username"
                type="text"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md border-green-500"
                :placeholder="editProductDetails?.name"
              />
            </div>
            <div>
              <label class="text-gray-700" for="emailAddress">Brand</label>
              <UInputMenu
                variant="none"
                v-model="formData.brand"
                :options="brands"
                :placeholder="editProductDetails?.brand.name"
                by="id"
                option-attribute="name"
                :search-attributes="['name']"
                class="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              >
                <template #option="{ option: brand }">
                  <span><img class="h-4 w-4" :src="brand.image" alt="" /></span>
                  <span class="truncate">{{ brand.name }}</span>
                </template>
              </UInputMenu>
            </div>
            <div>
              <label class="text-gray-700" for="emailAddress">Category</label>
              <UInputMenu
                variant="none"
                v-model="formData.productType"
                :options="categories"
                :placeholder="editProductDetails?.productType.name"
                by="id"
                option-attribute="name"
                :search-attributes="['name']"
                class="block w-full px-4 py-1 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              >
                <template #option="{ option: category }">
                  <span class="truncate">{{ category.name }}</span>
                </template>
              </UInputMenu>
            </div>

            <div>
              <label class="text-gray-700" for="password">Size</label>
              <input
                v-model="formData.size"
                id="size"
                type="text"
                :placeholder="editProductDetails?.size"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              />
            </div>

            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >UPC Code</label
              >
              <input
                v-model="formData.upcCode"
                id="passwordConfirmation"
                type="number"
                :placeholder="editProductDetails?.upcCode"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              />
            </div>
            <div>
              <label class="text-gray-700" for="passwordConfirmation"
                >Price</label
              >
              <input
                v-model="formData.originalPrice"
                :placeholder="
                  editProductDetails?.originalPrice.toFixed(2).toString()
                "
                id="passwordConfirmation"
                type="number"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-green-500 rounded-md"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              type="button"
              @click="setLoading(editProduct)"
              class="bg-green-500 flex items-center gap-2 w-full mb-4 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              <Icon name="eos-icons:loading" v-if="loading.loading" />
              Edit Product
            </button>
          </div>
        </form>
      </div>
    </UModal>
    <VendorSideBar />
    <section class="p-4 flex-1 min-h-screen container mx-auto my-12">
      <section class="container px-4 mx-auto">
        <div class="flex items-center justify-between flex-col lg:flex-row">
          <div class="flex items-center gap-x-3">
            <h2 class="text-lg font-medium text-gray-800">Vendor Products</h2>

            <span
              class="px-3 py-1 text-xs text-green-600 bg-green-100 rounded-full"
              >{{ count }} products</span
            >
          </div>
          <div class="relative flex items-center mt-4 md:mt-0">
            <span class="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mx-3 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>

            <input
              v-model="name"
              type="text"
              placeholder="Search"
              class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-between flex-col lg:flex-row mt-4"
        >
          <button
            @click="
              {
                clearFormData();
                showCreateModal = true;
              }
            "
            class="flex items-center gap-x-3 bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600"
          >
            Create Product
          </button>
          <div class="flex items-center gap-x-6">
            <button
              @click="buttonDelAll"
              class="text-gray-500 transition-colors duration-200 :text-red-500 hover:text-red-500 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex flex-col mt-6">
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
                        <div class="flex items-center gap-x-3">
                          <input
                            @click="selectAll"
                            v-if="selectedItems.length == products?.length"
                            type="checkbox"
                            class="text-green-500 border-gray-300 rounded"
                            checked
                          />
                          <input
                            v-else
                            @click="selectAll"
                            type="checkbox"
                            class="text-green-500 border-gray-300 rounded"
                          />
                          <span>Name</span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Brand</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Category</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        UPC Code
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Size
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in products" :key="item.id">
                      <td
                        class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                      >
                        <div class="inline-flex items-center gap-x-3">
                          <input
                            v-model="selectedItems"
                            :value="item.id"
                            type="checkbox"
                            class="text-green-500 border-gray-300 rounded"
                          />

                          <div class="flex items-center gap-x-2">
                            <img
                              class="object-cover w-10 h-10 rounded-full"
                              :src="item.image"
                              @error="imageHandling"
                              alt=""
                              loading="lazy"
                            />
                            <div>
                              <h2 class="font-medium text-gray-800">
                                {{ item.name }}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
                      >
                        <div class="flex flex-col">
                          <img
                            class="object-cover w-10 h-10 rounded-full"
                            :src="item.brand.image"
                            alt=""
                            loading="lazy"
                          />
                          <p class="">{{ item.brand.name }}</p>
                        </div>
                      </td>
                      <td
                        class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap"
                      >
                        {{ item.productType.name }}
                      </td>
                      <td
                        class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap"
                      >
                        {{ item.upcCode }}
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <p>{{ item.size }}</p>
                      </td>
                      <td
                        class="px-4 py-4 text-sm whitespace-nowrap text-green-600"
                      >
                        <p>₱{{ item.originalPrice.toFixed(2) }}</p>
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div class="flex items-center gap-x-6">
                          <button
                            @click="buttonDel(item.id)"
                            class="text-gray-500 transition-colors duration-200 :text-red-500 hover:text-red-500 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>

                          <button
                            @click="editButton(item.id)"
                            class="text-gray-500 transition-colors duration-200 :text-yellow-500 hover:text-yellow-500 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
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
          :page-count="activeQuery.take"
          class="mt-4 mx-auto"
        />
      </div>
    </section>
  </main>
  <Footer />
</template>
