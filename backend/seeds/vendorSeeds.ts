import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Coca Cola Bottlers Phil's Incorporated

db.vendor.create({
    data: {
        name: "Coca Cola Bottlers Phil's Incorporated",
        image: "https://1000logos.net/wp-content/uploads/2021/05/Coca-Cola-logo.png",
    }
}).then(() => {
    console.log("Coca Cola Bottlers Phil's Incorporated Vendor created successfully!");
})
    .catch((error) => {
        console.error("Error creating vendors:", error);
    })
    .finally(async () => {
        await db.$disconnect();
    });

// Random Vendors

const vendors = Array.from({ length: 10 }, () => {
    return {
        name: faker.company.name(),
        image: faker.image.urlLoremFlickr({ category: "business" })
    }
})

db.vendor.createMany({
    data: vendors
})
    .then(() => {
        console.log("Vendors created successfully!");
    })
    .catch((error) => {
        console.error("Error creating vendors:", error);
    })
    .finally(async () => {
        await db.$disconnect();
    });

