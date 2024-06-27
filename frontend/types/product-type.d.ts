declare interface ProductType {
    id: number;
    markupRate: number;
    stock: number;
    store: {
        id: number;
        name: string;
        image: string;
    };
    storeId: number;
    product: VendorProductType
    userCart: number;
    productsSold: number;
}