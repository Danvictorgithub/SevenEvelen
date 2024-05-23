export default async function () {
    const { status, token } = useAuth();
    if (status.value == "authenticated") {
        const API = useRuntimeConfig().public.API;
        const data = await $fetch<number>(`${API}/user_cart/count`, {
            headers: { Authorization: token.value as string },
        });
        if (data) {
            cartNumber().value = data;
        }
    }
}