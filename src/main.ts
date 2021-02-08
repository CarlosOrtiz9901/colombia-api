import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get('ConfigService').envConfig;

  app.enableCors();

  const port = process.env.PORT || configService.APP_PORT || '1999';
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on ${configService.APP_HOST_SERVER}:${port}/`);
}
bootstrap();
