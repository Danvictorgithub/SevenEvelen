import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
// import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt"
require('dotenv').config({ path: '../.env' })
const db = new PrismaClient()
async function genUser(noUsers: number) {
    Array.from({ length: noUsers })
        .forEach(async (_, i) => {
            await db.user.create({
                data: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email({ provider: "gmail.com" }),
                    password: bcrypt.hashSync("12345678", parseInt(process.env.SECRET_KEY)),
                    image: faker.image.urlLoremFlickr({ category: 'people' })
                }
            });
        })
    console.log(`${noUsers} Users generated successfully!`)
}
genUser(324);
