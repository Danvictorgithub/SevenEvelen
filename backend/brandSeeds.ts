import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const sevenElevenBrands = [
    { name: "Coca-Cola", image: "https://1000logos.net/wp-content/uploads/2021/05/Coca-Cola-logo.png" },
    { name: "Pepsi", image: "https://1000logos.net/wp-content/uploads/2017/05/Pepsi-logo.png" },
    { name: "Red Bull", image: "https://1000logos.net/wp-content/uploads/2021/04/Red-Bull-logo.png" },
    { name: "Monster", image: "https://www.hatchwise.com/wp-content/uploads/2022/01/Monster-Energy-Symbol-1024x576.png    " },
    { name: "Hershey's", image: "https://1000logos.net/wp-content/uploads/2020/07/Hershey-Logo.png" },
    { name: "M&M's", image: "https://1000logos.net/wp-content/uploads/2022/10/MMs-logo.png" },
    { name: "Snickers", image: "https://1000logos.net/wp-content/uploads/2020/06/Snickers-Logo.png" },
    { name: "Lays", image: "https://logolook.net/wp-content/uploads/2022/02/Lays-Logo.png" },
    { name: "Doritos", image: "https://1000logos.net/wp-content/uploads/2020/07/Doritos-Logo.png" },
    { name: "Chips Ahoy!", image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Chips_ahoy_brandlogo.png" },
    { name: "Lipton", image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Lipton_logo_%282014-present%29.svg" },
    { name: "Nescafe", image: "https://logos-world.net/wp-content/uploads/2020/09/Nescafe-Logo.png" },
    { name: "Lucky Me!", image: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lucky_Me_logo_%28since_2021%29.png" },
    { name: "Smirnoff", image: "https://1000logos.net/wp-content/uploads/2021/05/Smirnoff-logo.png" },
    { name: "Swiss Miss", image: "https://swissmissisamisshome.files.wordpress.com/2019/03/cropped-swissmisstransparent-11.png" },
    { name: "Colage", image: "https://1000logos.net/wp-content/uploads/2016/12/Colgate-logo.png" },
    { name: "Dove", image: "https://1000logos.net/wp-content/uploads/2021/04/Dove-logo.png" },
    { name: "Energizer", image: "https://1000logos.net/wp-content/uploads/2022/06/Energizer-logo.png" }
];

async function seedBrands() {
    const brands = await db.brand.createMany({ data: sevenElevenBrands });
    console.log("Brands created successfully!");
}

seedBrands()
    .catch((error) => {
        console.error("Error creating product types:", error);
    })
    .finally(async () => {
        await db.$disconnect();
    });