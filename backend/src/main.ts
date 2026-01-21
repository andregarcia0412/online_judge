import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('online judge API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Service running on port ${port}`);
  console.log(`📚 Swagger docs on http://localhost:${port}/docs`);
}
bootstrap();
