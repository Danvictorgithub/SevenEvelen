import { brandSeeds } from "./brandSeeds";
import { cartSeeds } from "./cartSeeds";
import { categorySeeds } from "./categorySeeds";
import { productSeeds } from "./productSeeds";
import { storeSeeds } from "./storeSeeds";
import { transactionSeeds } from "./transactionSeeds";
import { userSeeds } from "./userSeeds";
import { vendorProductSeeds } from "./vendorProductSeeds";
import { vendorSeeds } from "./vendorSeeds";

async function generateSeeds3() {
    await transactionSeeds(500)
    await cartSeeds(250)
    // await transactionSeeds(1000)
}
generateSeeds3()