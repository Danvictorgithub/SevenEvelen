import { faker } from "@faker-js/faker";
import { PrismaClient, Product } from "@prisma/client";

const db = new PrismaClient()

export async function productSeeds(multi: number) {
    await genProducts(multi);
    console.log("Finished Generating")
}
async function genProducts(multi: number) {
    const vendorProducts = await db.vendorProduct.findMany();
    const stores = await db.store.findMany();
    for (const store in stores) {
        const tempVendorProducts = [...vendorProducts];
        const tempStores = [...stores];

        const randomVendorProducts = []
        const randomStores = [];
        const noProducts = Math.floor(Math.random() * multi);
        for (let i = 0; i < noProducts && tempVendorProducts.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * tempVendorProducts.length);
            const randomVendorProduct = tempVendorProducts[randomIndex];
            randomVendorProducts.push(randomVendorProduct);
            tempVendorProducts.splice(randomIndex, 1);
        }
        for (let i = 0; i < noProducts && tempStores.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * tempStores.length);
            const randomStore = tempStores[randomIndex];
            randomStores.push(randomStore);
            tempStores.splice(randomIndex, 1);
        }
        for (let i = 0; i < noProducts; i++) {
            const randomIndex = Math.floor(Math.random() * randomVendorProducts.length);
            const randomVendorProduct = randomVendorProducts[randomIndex];
            const randomStore = randomStores[randomIndex];
            const product = {
                productId: randomVendorProduct.id,
                storeId: randomStore.id,
                stock: Math.floor(Math.random() * 1000),
                markupRate: Math.floor(Math.random() * 100),
            }
            try {
                await db.product.create({ data: product });
            }
            catch (err) {
                console.log("unique constraint skipped");
            }
        }
    };
}