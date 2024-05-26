declare interface TransactionType {
    id: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    transactionItems: Array<CartItem>
}