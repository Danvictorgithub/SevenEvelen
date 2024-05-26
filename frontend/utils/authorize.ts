export default async function (type: 'Customer' | 'Admin' | 'Vendor' = 'Customer') {
    const { status, token, data } = useAuth();
    if (status.value == "unauthenticated") {
        await navigateTo("/");
    }
    if (type) {
        if (type == 'Customer') {
            return;
        }
        else if (
            (data.value as any).status == type
        ) { } else {
            await navigateTo("/");
        }
    }
}