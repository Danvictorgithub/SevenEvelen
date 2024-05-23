
export default function (product: ProductType): string {
    return (((product.markupRate / 100) * product.product.originalPrice) + product.product.originalPrice).toFixed(2);
}