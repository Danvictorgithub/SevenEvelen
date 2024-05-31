declare interface VendorProductType {
    id: number;
    name: string;
    image: string;
    upcCode: string;
    size: string;
    originalPrice: number;
    productType: CategoryType
    brand: BrandType
    vendor: VendorType
}