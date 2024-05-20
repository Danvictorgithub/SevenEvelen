import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()
async function genCart(noCart: number) {
    const users = await db.user.findMany();
    const products = await db.product.findMany({ include: { product: true } });
    Array.from({ length: noCart })
        .forEach(async (_, i) => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const noProducts = Math.floor(Math.random() * 10) + 1;
            const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, noProducts);

            randomProducts.forEach(async (product) => {
                const checkConstraint = await db.cartItem.findFirst({
                    where: {
                        AND: [
                            { userId: randomUser.id },
                            { productId: product.id }
                        ]
                    }
                })
                if (!checkConstraint) {
                    await db.cartItem.create({ data: { userId: randomUser.id, productId: product.id, quantity: Math.floor(Math.random() * (product.stock * .30) + 1) } })
                }

            })
            // const transactionsItems = randomProducts.map(product => {
            //     return { productId: product.id, quantity: Math.floor(Math.random() * 10) + 1 }
            // })
            // let totalPrice = 0;
            // for (let i = 0; i < transactionsItems.length; i++) {
            //     totalPrice += transactionsItems[i].quantity * (randomProducts[i].product.originalPrice + ((randomProducts[i].markupRate / 100) * randomProducts[i].product.originalPrice));
            // }
            // await db.transaction.create({
            //     data: {
            //         userId: randomUser.id,
            //         transactionItems: { createMany: { data: transactionsItems } },
            //         totalAmount: totalPrice
            //     }
            // });
        })
    console.log(`${noCart} Carts generated successfully!`)
}

genCart(1000);