import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('🚀 Starting NestJS application...');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  logger.log('✅ AppModule created');

  // Global exception filter - temporarily disabled to test
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ila26 User API')
    .setDescription('API documentation for ila26 User API - Multi-tenant enterprise management platform')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:30000',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  logger.log(`🚀 User API is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  
  // Log registered routes
  const router = app.getHttpAdapter().getInstance()._router;
  const routeCount = router?.stack?.filter((layer: any) => layer.route).length || 0;
  logger.log(`📋 Registered routes: ${routeCount}`);
  
  if (routeCount > 0) {
    logger.log('Routes:');
    router?.stack?.forEach((layer: any, index: number) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        logger.log(`   ${index + 1}. ${methods} ${layer.route.path}`);
      }
    });
  }
}
bootstrap();
