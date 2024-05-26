export default async function setLoading(callback: Function, id: number = 0) {
    const loading = loadingStore();
    loading.value.loading = true;
    await callback();
    loading.value.loading = false;
}