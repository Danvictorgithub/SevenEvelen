export default async function setLoading(callback: Function, id: number = 0) {
    const loading = loadingStore();
    if (id !== 0) {
        loading.value.id = id;
    }
    if (loading.value.loading) return;
    loading.value.loading = true;
    try {
        await callback();
    }
    catch (e) {

    }
    loading.value.loading = false;
}