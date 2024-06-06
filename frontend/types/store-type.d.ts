declare interface StoreType {
    id: number
    name: string;
    image: string;
    address: string;
    opening_hours: string;
    long: string;
    lat: string;
    createdAt: Date;
    updatedAt: Date;
    products: ProductType[]
    _count: { products: number }
    noProductSold: number;
}