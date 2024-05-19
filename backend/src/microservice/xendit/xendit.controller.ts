import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { XenditService } from './xendit.service';
import { BuyNowDto } from './dto/buy-now.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { JwtAuthGuard } from 'src/authentication/auth/jwt.auth.guard';
import { RequestUser } from 'src/users/cart/cart.controller';

@Controller('xendit')
export class XenditController {
  constructor(private readonly xenditService: XenditService) { }

  @Post('buynow')
  @UseGuards(JwtAuthGuard)
  buynow(@Body() buyNowDto: BuyNowDto, @Request() req: RequestUser) {
    return this.xenditService.buynow(buyNowDto, req.user.id);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Body() checkOutDto: CheckOutDto, @Request() req: RequestUser) {
    return this.xenditService.checkout(checkOutDto, req.user.id);
  }
}
