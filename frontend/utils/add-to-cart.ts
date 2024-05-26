export default async function (e: Event | null, quantity: number | null = null, id: number | null = null) {
    const API = useRuntimeConfig().public.API;
    const { status, token } = useAuth();
    if (status.value === 'unauthenticated') {
        return await navigateTo('/signin');
    }
    if (e) {
        const HTMLButton = e.target as HTMLButtonElement;
        id = parseInt(HTMLButton.id);
    }
    if (!id) {
        alert("Provide Id or HTMLEvent with id");
        return;
    }
    const data = await $fetch<{ quantity: number }>(`${API}/user_cart`, {
        method: 'POST',
        headers: { Authorization: token.value as string },
        body: JSON.stringify({
            productId: id,
            quantity: (quantity) ? quantity : 1
        })
    }).catch(e => {
        if (e.data) {
            alert(e.data.message);
        }
        else if (e) {
            alert(e);
        }
    })
    if (data) {
        cartNumber().value = await $fetch(`${API}/user_cart/count`, {
            headers: { Authorization: token.value as string },
        })
        cartModal().value = true;
    }
}