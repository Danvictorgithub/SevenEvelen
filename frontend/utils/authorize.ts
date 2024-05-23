export default async function () {
    const { status, token } = useAuth();
    if (status.value == "unauthenticated") {
        await navigateTo("/");
    }
}