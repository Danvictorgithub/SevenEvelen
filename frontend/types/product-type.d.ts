declare interface ProductType {
    id: number;
    markupRate: number;
    stock: number;
    store: {
        name: string;
        image: string;
    };
    product: VendorProductType
    userCart: number;
}