declare interface UserAuth {
    id: number;
    email: string;
    status: 'Admin' | 'Vendor' | 'Customer'
}