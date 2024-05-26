import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BuyNowDto } from './dto/buy-now.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios, { AxiosError } from 'axios';

export interface XenditInvoiceResponse {
    id: string,
    external_id: string,
    user_id: string,
    status: "PENDING" | "EXPIRED" | "SETTLED" | "FAILED" | "PAID",
    merchant_name: string,
    merchant_profile_picture_url: string,
    amount: number,
    payer_email: string,
    description: string,
    expiry_date: string,
    invoice_url: string,
    customer: Object,
}

@Injectable()
export class XenditService {
    constructor(private readonly prisma: PrismaService) { }
    async buynow(buyNowDto: BuyNowDto, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not Found");
        }
        const product = await this.prisma.product.findUnique({ where: { id: buyNowDto.productId }, include: { product: true } });
        if (!product) {
            throw new NotFoundException("Product not Found");
        }
        if (product.stock < buyNowDto.quantity) {
            throw new NotFoundException("quantity out of range of stock");
        }
        const { data } = await axios.post<XenditInvoiceResponse>("https://api.xendit.co/v2/invoices", {
            customer: { email: user.email, given_names: user.firstName, surname: user.lastName },
            external_id: `${product.id.toString()}-${user.id}`,
            description: "UserBuyNow",
            amount: (product.product.originalPrice + (product.markupRate / 100 * product.product.originalPrice)) * buyNowDto.quantity,
            currency: "PHP",
            customer_notification_preference: {
                "invoice_paid": ["email"],
            },
            success_redirect_url: `${process.env.FRONTEND_URL}/user/    transactions`,
            items: [{
                name: product.product.name,
                quantity: buyNowDto.quantity,
                price: (product.product.originalPrice + (product.markupRate / 100 * product.product.originalPrice)),
                url: `${process.env.FRONTEND_URL}/products/${product.id}`
            }]
        }, { auth: { username: process.env.Xendit_SK, password: "" } })
            .catch((e: AxiosError) => {
                if (e.response) {
                    throw new BadRequestException(e.response.data)
                }
                else if (e.request) {
                    throw new Error(e.request);
                }
                else {
                    throw new Error(e.message);
                }
            })
        return data;
    }

    async checkout(checkOutDto: CheckOutDto, userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException("User not Found");
        }
        const products = await this.prisma.cartItem.findMany({ where: { userId, id: { in: checkOutDto.products } }, include: { product: { include: { product: true } }, user: true } });

        if (products.length != checkOutDto.products.length) {
            throw new BadRequestException("Some products not found");
        }
        else if (products.length == 0) {
            throw new BadRequestException("No products found in cart");
        }
        const amount = products.reduce((acc, cur) => (acc + (cur.product.product.originalPrice + ((cur.product.markupRate / 100) * cur.product.product.originalPrice)) * cur.quantity), 0);
        const { data } = await axios.post<XenditInvoiceResponse>("https://api.xendit.co/v2/invoices", {
            external_id: `${products.map(p => p.id).join("-")}-${user.id}`,
            description: "UserCheckout",
            amount,
            currency: "PHP",
            customer: { "email": user.email },
            customer_notification_preference: {
                "invoice_paid": ["email"],
            },
            success_redirect_url: `${process.env.FRONTEND_URL}/user/transactions`,
            items: products.map(p => ({
                name: p.product.product.name,
                quantity: p.quantity,
                price: p.product.product.originalPrice + (p.product.markupRate / 100 * p.product.product.originalPrice),
                url: `${process.env.FRONTEND_URL}/products/${p.id}`
            }))
        }, { auth: { username: process.env.Xendit_SK, password: "" } })
            .catch((e: AxiosError) => {
                if (e.response) {
                    throw new BadRequestException(e.response.data)
                }
                else if (e.request) {
                    throw new Error(e.request);
                }
                else {
                    throw new Error(e.message);
                }
            })
        return data;
    }
}
