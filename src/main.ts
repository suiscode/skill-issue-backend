import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultDevOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://studio.apollographql.com',
    'https://sandbox.embed.apollographql.com',
  ];
  const allowedOrigins =
    configuredOrigins.length > 0
      ? configuredOrigins
      : isProduction
        ? []
        : defaultDevOrigins;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
