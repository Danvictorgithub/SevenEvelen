import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronjobsService {
    constructor(private readonly prisma: PrismaService) { }

    async deliverReorder() {
        const reorders = await this.prisma.reorder.findMany({
            where: {
                status: 'Approved',
                deliveryDate: { lte: new Date() }
            }
        });
        const reorderItems = await this.prisma.reorderItems.findMany({ where: { reorderId: { in: reorders.map(reorder => reorder.id) } } });
        const productIds = reorderItems.map(reorderItem => reorderItem.productId);
        const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });
        const productMap = products.reduce((map, product) => ({ ...map, [product.id]: product }), {});
        for (const reorder of reorders) {
            const items = reorderItems.filter(reorderItem => reorderItem.reorderId === reorder.id);
            for (const item of items) {
                const product = productMap[item.productId];
                await this.prisma.product.update({
                    where: { id: product.id },
                    data: { stock: product.stock + item.quantity }
                });
            }
            await this.prisma.reorder.update({
                where: { id: reorder.id },
                data: { status: 'Delivered' }
            });
        }
        return reorders.map(reorder => ({ ...reorder, status: 'Delivered' }));
    }

    async reorderNewProducts() {
        const newProducts = await this.prisma.vendorProduct.findMany({
            where: {
                products: {
                    none: {},
                },
            },
        });
        return newProducts
    }
}
