import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient, User } from "@prisma/client";
import * as bcrypt from "bcrypt"

const db = new PrismaClient();
// Coca Cola Bottlers Phil's Incorporated
export async function createCocaColaVendor() {
    const cocaColaUser: User = await db.user.create({
        data: {
            email: "cocacola@gmail.com",
            password: bcrypt.hashSync("12345678", parseInt(process.env.SECRET_KEY)),
            firstName: "Coca",
            lastName: "Cola",
            status: "Vendor"
        }
    });
    await db.vendor.create({
        data: {
            userId: cocaColaUser.id,
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
}

async function createRandomVendors() {
    // Random Vendors
    const vendorUsers: Array<Prisma.UserCreateInput> = Array.from({ length: 10 }, () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
            email: faker.internet.email({ provider: "gmail.com", firstName: firstName, lastName: lastName }).toLowerCase(),
            password: bcrypt.hashSync("12345678", parseInt(process.env.SECRET_KEY)),
            firstName,
            lastName,
            status: 'Vendor',
        }
    })
    const newVendors = await db.user.createMany({ data: vendorUsers });
    const newVendorIds = vendorUsers.map(async (vendor) => {
        const userVendor = await db.user.findUnique({ where: { email: vendor.email } })
        return userVendor.id
    });
    const resolvedIds = await Promise.all(newVendorIds);
    const vendors = resolvedIds.map((id) => {
        return {
            name: faker.company.name(),
            image: faker.image.urlLoremFlickr({ category: 'business' }),
            userId: id
        }
    })

    await db.vendor.createMany({
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
}

export async function vendorSeeds() {
    await createCocaColaVendor();
    await createRandomVendors();
}


