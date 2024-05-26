declare interface ProductType {
    id: number;
    markupRate: number;
    stock: number;
    store: {
        name: string;
        image: string;
    };
    product: {
        name: string;
        image: string;
        upcCode: string;
        size: string;
        originalPrice: number;
        productType: { name: string };
        brand: {
            name: string;
            image: string;
        };
        vendor: {
            name: string;
            image: string;
        };

    };
    userCart: number;
}