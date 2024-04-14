import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { message: "Welcome to SevenEvelen API v1.0.0" };
  }
}
