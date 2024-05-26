import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const sevenEleven = {
    "Drinks": {
        "Hot Drinks": ["Coffee", "Tea", "Hot Chocolate"],
        "Cold Drinks": ["Soda", "Juice", "Water", "Sports Drinks", "Energy Drinks"],
        "Alcoholic Beverages": ["Beer", "Wine", "Spirits"]
    },
    "Snacks": {
        "Sweet Snacks": ["Candy", "Chocolate", "Cookies", "Chips"],
        "Savory Snacks": ["Nuts", "Jerky", "Dried Fruit", "Pretzels", "Popcorn"],
        "Frozen Snacks": ["Ice Cream", "Frozen Yogurt", "Mochi"]
    },
    "Food": {
        "Hot Food": ["Hot Dogs", "Sandwiches", "Pizza", "Taquitos"],
        "Ready-to-Eat Meals": ["Salads", "Wraps", "Sandwiches"],
        "Frozen Food": ["Microwave Meals", "Burritos", "Ice Cream"]
    },
    "Personal Care": {
        "Hygiene Products": ["Shampoo", "Soap", "Toothpaste", "Deodorant"],
        "Over-the-Counter Medicine": ["Pain Relief", "Allergy Relief", "Cold & Flu"]
    },
    "Household Goods": {
        "Cleaning Supplies": ["Paper Towels", "Dish Soap", "Laundry Detergent"],
        "Batteries": ["AA", "AAA", "C", "D"],
        "Light Bulbs": ["Incandescent", "LED", "CFL"]
    }
};

export async function categorySeeds() {
    const topLevelTypes = await Promise.all(
        Object.keys(sevenEleven).map(async (categoryName) => {
            return db.productType.create({
                data: { name: categoryName },
            });
        })
    );

    // Loop through categories and create subcategories
    for (const [categoryName, subcategories] of Object.entries(sevenEleven)) {
        const currentType = topLevelTypes.find((type) => type.name === categoryName);
        for (const subcategoryName of Object.keys(subcategories)) {
            await db.productType.create({
                data: {
                    name: subcategoryName,
                    productTypeParentId: currentType.id,
                },
            });
        }
    }

    console.log("Product Types created successfully!");
}

// categorySeeds()
//     .catch((error) => {
//         console.error("Error creating product types:", error);
//     })
//     .finally(async () => {
//         await db.$disconnect();
//     });