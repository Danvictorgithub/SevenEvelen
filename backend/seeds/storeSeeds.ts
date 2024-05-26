import { PrismaClient } from "@prisma/client";

const fs = require("fs");
const { parse } = require("csv-parse");
const db = new PrismaClient()

export async function storeSeeds() {
    await genStore();
    await console.log("Finished Generating")
}
const genStore = async () => {
    let stores = [];
    fs.createReadStream("./seeds/p7_stores.csv")
        .pipe(parse({ autoParse: true }))
        .on("data", function (row) {
            const data = {
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/2110px-7-eleven_logo.svg.png",
                opening_hours: "24/7",
                name: `${row[1]} Branch`,
                address: row[2],
                long: row[8],
                lat: row[7]
            }
            if (!data.long || !data.lat) {
                return;
            }
            stores.push(data);
        })
        .on("end", async function () {
            await db.store.createMany({ skipDuplicates: true, data: stores })
            console.log("finished generating stores");
        })
        .on("error", function (error) {
            console.log(error.message);
        });
}
// storeSeeds();