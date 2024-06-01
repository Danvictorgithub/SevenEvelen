declare interface reorderType {
    id: string;
    vendorId: number;
    status: "Pending" | "Approved" | "Rejected" | "Delivered";
    deliveryDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    reorderItems: CartItem[]
}