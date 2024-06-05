import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const totalEarning = (await this.prisma.transaction.aggregate({ _sum: { totalAmount: true } }))._sum.totalAmount.toFixed(2);
        const noStores = await this.prisma.store.count();
        const noProducts = await this.prisma.product.count();
        const noUsers = await this.prisma.user.count();
        const allTransactions = await this.prisma.transaction.findMany({ select: { totalAmount: true, createdAt: true } });
        const transactionsByMonth = allTransactions.reduce((groups, transaction) => {
            const month = transaction.createdAt.getMonth(); // getMonth() returns a number from 0 (January) to 11 (December)
            if (!groups[month]) {
                groups[month] = 0;
            }
            groups[month] += transaction.totalAmount;
            return groups;
        }, {});
        const transactionsThisWeek = allTransactions.reduce((days, transaction) => {
            const today = new Date();
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            if (transaction.createdAt >= weekStart && transaction.createdAt <= weekEnd) {
                if (!days[transaction.createdAt.getDay()]) {
                    days[transaction.createdAt.getDay()] = 0;
                }
                days[transaction.createdAt.getDay()] += transaction.totalAmount;
            }

            return days;
        }, {})
        const inventory = (await this.prisma.product.aggregate({ _sum: { stock: true } }))._sum.stock;
        return { totalEarning, noStores, noProducts, noUsers, transactionsByMonth, transactionsThisWeek, inventory }
    }
}
