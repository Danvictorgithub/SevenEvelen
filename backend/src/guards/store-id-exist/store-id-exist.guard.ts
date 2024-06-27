import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreIdExistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const storeId = context.switchToHttp().getRequest().params.storeId;
    const store = this.prisma.store.findUnique({ where: { id: +storeId } }).then((res) => true).catch((res) => false);
    return store;
  }
}
