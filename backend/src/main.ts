import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as logger from "morgan";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(logger('dev'));
  await app.listen((process.env.PORT) ? process.env.PORT : 8080)
}
bootstrap();
