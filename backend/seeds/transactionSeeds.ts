import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()
export async function transactionSeeds(noTransactions: number) {
    const users = await db.user.findMany();
    const products = await db.product.findMany({ include: { product: true } });
    Array.from({ length: noTransactions })
        .forEach(async (_, i) => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const noProducts = Math.floor(Math.random() * 10) + 1;
            const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, noProducts);
            const transactionsItems = randomProducts.map(product => {
                return { productId: product.id, quantity: Math.floor(Math.random() * 10) + 1 }
            })
            let totalPrice = 0;
            for (let i = 0; i < transactionsItems.length; i++) {
                totalPrice += transactionsItems[i].quantity * (randomProducts[i].product.originalPrice + ((randomProducts[i].markupRate / 100) * randomProducts[i].product.originalPrice));
            }
            await db.transaction.create({
                data: {
                    userId: randomUser.id,
                    transactionItems: { createMany: { data: transactionsItems } },
                    totalAmount: totalPrice
                }
            });
        })
    console.log(`${noTransactions} Transactions generated successfully!`)
}

// transactionSeeds(1000);