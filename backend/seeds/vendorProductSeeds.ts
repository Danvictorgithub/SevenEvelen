import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const db = new PrismaClient()
const cocaColaProducts: Array<{ name: string, image: string, upcCode: number, size: string, originalPrice: number }> = [
    {
        name: "Coca-Cola Classic",
        image: "https://images-cdn.ubuy.co.in/657163c18cc26b20246d8164-coca-cola-classic-coke-soft-drink.jpg", // Replace with actual image URL
        upcCode: 123456789123,
        size: "12 fl oz",
        originalPrice: 1.25
    },
    {
        name: "Sprite Zero Sugar",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcH2HpT_rvYSmuV7hccP2FOIVmwF2JUki3G9WsGZ8s8A&s", // Replace with actual image URL
        upcCode: 123451100058,
        size: "20 fl oz",
        originalPrice: 1.50
    },
    {
        name: "Coca-Cola Zero Sugar",
        image: "https://www.thewarehouse.co.nz/dw/image/v2/BDMG_PRD/on/demandware.static/-/Sites-twl-master-catalog/default/dw0daaeb86/images/hi-res/6A/44/R2833093_30.jpg?sw=765&sh=765", // Replace with actual image URL
        upcCode: 123451100074,
        size: "12 fl oz",
        originalPrice: 1.25
    },
    {
        name: "Diet Coke",
        image: "https://www.coca-cola.com/content/dam/onexp/us/en/brands/diet-coke/en_diet%20coke_prod_original_en_diet%20coke_prod_caffeine%20free_750x750_v1.jpg", // Replace with actual image URL
        upcCode: 123451100123456,
        size: "12 fl oz",
        originalPrice: 1.25
    },
    {
        name: "Fanta Orange",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfmMybYCTj4DMXfAPjKJeiBovRbIjctRWZoqRf6-iWMA&s", // Replace with actual image URL
        upcCode: 123451100123,
        size: "20 fl oz",
        originalPrice: 1.50
    },
    {
        name: "Sprite",
        image: "https://m.media-amazon.com/images/I/61wh+v9s0zL.jpg", // Replace with actual image URL
        upcCode: 123451100090,
        size: "12 fl oz",
        originalPrice: 1.25
    },
    {
        name: "Powerade Mountain Berry Blast",
        image: "https://www.ghcreid.com/wp-content/uploads/2017/10/PoweradeMountainBerryBlast32oz-510x510.jpeg", // Replace with actual image URL
        upcCode: 123451100456,
        size: "32 fl oz",
        originalPrice: 2.00
    },
    {
        name: "Minute Maid Apple Juice",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7BSIgfXAgyrYYLNEJdzdycZ9L7rVb6fIkAuTjA3TaRg&s", // Replace with actual image URL
        upcCode: 123451100234,
        size: "64 fl oz",
        originalPrice: 3.00
    },
    {
        name: "Hi-C Orange Lavaburst",
        image: "https://i5.walmartimages.com/seo/Hi-C-Orange-Lavaburst-Fruit-Juice-6-fl-oz-8-Juice-Boxes_7bf206b6-965a-4686-86a4-b251680c86d6.c3e594a5f4be8ca06b16cb354a677a59.jpeg", // Replace with actual image URL
        upcCode: 123451101234578,
        size: "12 fl oz",
        originalPrice: 1.00
    },
    {
        name: "Aquafina Sparkling Water",
        image: "https://cdnprod.mafretailproxy.com/sys-master-root/h40/h7e/15846383779870/590173_main.jpg_480Wx480H", // Replace with actual image URL
        upcCode: 123451100567,
        size: "20 fl oz",
        originalPrice: 1.00
    }
];

async function generateCocaColaVendorProducts() {
    const vendor = await db.vendor.findFirst({ where: { name: { contains: "Coca", mode: "insensitive" } } });
    if (!vendor) {
        console.log("Coca-Cola vendor not found");
        return;
    }
    const brand = await db.brand.findFirst({ where: { name: { contains: "Coca", mode: "insensitive" } } });
    if (!brand) {
        console.log("Coca-Cola brand not found");
        return;
    }
    const productType = await db.productType.findFirst({ where: { name: { contains: "Cold", mode: "insensitive" } } });
    if (!productType) {
        console.log("Cold product type not found");
        return;
    }
    for (const product of cocaColaProducts) {
        await db.vendorProduct.create({
            data: {
                name: product.name,
                image: product.image,
                upcCode: product.upcCode.toString(),
                size: product.size,
                originalPrice: product.originalPrice * 50,
                brandId: brand.id,
                vendorId: vendor.id,
                productTypeId: productType.id
            }
        });
    }
    console.log("Coca-Cola vendor products generated");
}
generateCocaColaVendorProducts()

async function generateRandomVendorProducts() {
    const vendors = await db.vendor.findMany();
    const brands = await db.brand.findMany();
    const productTypes = await db.productType.findMany();
    for (let i = 0; i < 100; i++) {
        const vendor = faker.helpers.arrayElement(vendors);
        const brand = faker.helpers.arrayElement(brands);
        const productType = faker.helpers.arrayElement(productTypes);
        await db.vendorProduct.create({
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
    }
    console.log("Random vendor products generated");
}
generateRandomVendorProducts()
    .catch((error) => {
        console.error("Error generating vendor products:", error);
    })
    .finally(async () => {
        await db.$disconnect();
    });