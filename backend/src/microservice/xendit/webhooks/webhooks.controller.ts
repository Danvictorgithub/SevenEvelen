import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface XenditWebhook_payment_success {
  id: string;
  external_id: string;
  user_id: string;
  is_high: true
  payment_method: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount: number;
  bank_code: string;
  paid_at: string;
  payer_email: string;
  description: 'UserBuyNow' | 'UserCheckout'
  adjusted_received_amount: number;
  fees_paid_amount: number
  created: string;
  updated: string;
  currency: string;
  payment_channel: string;
  payment_destination: string;
  items: Array<{ name: string, price: number, quantity: number }>

}

@Controller('xendit/webhooks')
export class WebhooksController {
  constructor(private readonly prisma: PrismaService) { }
  @Post('payment_success'
  )
  async paymentSuccess(@Body() body: XenditWebhook_payment_success) {
    if (body.description === 'UserBuyNow') {
      const [productId, userId] = body.external_id.split('-');
      const user = await this.prisma.user.findUnique({ where: { id: parseInt(userId) } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const product = await this.prisma.product.findUnique({ where: { id: parseInt(productId) }, include: { product: true } });
      if (!product) {
        throw new NotFoundException("Product not found");
      }
      return this.prisma.transaction.create({
        data: {
          userId: parseInt(userId),
          totalAmount: body.paid_amount,
          transactionItems: { create: { quantity: body.items[0].quantity, productId: parseInt(productId) } }
        },
        include: { transactionItems: { include: { product: { include: { product: true } } } } }
      });
    }
    else if (body.description === 'UserCheckout') {
      const productIds = body.external_id.split('-').map((id) => parseInt(id));
      const userId = productIds.pop();
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const products = await this.prisma.cartItem.findMany({ where: { id: { in: productIds } }, include: { product: true } });
      const newTransaction = await this.prisma.transaction.create({
        data: {
          userId,
          totalAmount: body.paid_amount,
          transactionItems: { createMany: { data: products.map((product) => ({ productId: product.product.id, quantity: product.quantity })) } }
        }
      })
      await this.prisma.cartItem.deleteMany({ where: { id: { in: productIds } } });
      return newTransaction;
    }
    else {
      return { message: "Success Webhook Test" }
    }
  }
  // @Post()
  // create(@Body() createWebhookDto: CreateWebhookDto) {
  //   return this.webhooksService.create(createWebhookDto);
  // }

  // @Get()
  // findAll() {
  //   return this.webhooksService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.webhooksService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
  //   return this.webhooksService.update(+id, updateWebhookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.webhooksService.remove(+id);
  // }
}