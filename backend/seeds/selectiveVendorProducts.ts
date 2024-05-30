import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const db = new PrismaClient()
async function generateRandomVendorProducts(id: number, noItems: number) {
    const vendor = await db.vendor.findUnique({ where: { id } });
    const brands = await db.brand.findMany();
    const productTypes = await db.productType.findMany();
    for (let i = 0; i < noItems; i++) {
        const brand = faker.helpers.arrayElement(brands);
        const productType = faker.helpers.arrayElement(productTypes);
        const newVendorProduct = await db.vendorProduct.create({
            data: {
                name: faker.commerce.productName(),
                image: faker.image.urlLoremFlickr({ category: productType.name.split(' ').join('-') }),
                upcCode: faker.string.numeric(12),
                size: `${faker.number.int({ min: 10, max: 5000 })} g`,
                originalPrice: faker.number.float({ min: 1, max: 100 }),
                brandId: brand.id,
                vendorId: vendor.id,
                productTypeId: productType.id
            }
        });
        console.log(newVendorProduct);
    }
    console.log("Random vendor products generated");
}
generateRandomVendorProducts(17, 100);
