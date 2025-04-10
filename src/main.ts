import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  const dbHost = configService.get<string>('DB_HOST');
  const dbPort = configService.get<number>('DB_PORT');
  const dbName = configService.get<string>('DB_NAME');

  await app.listen(port, () => {
    console.log('=================================');
    console.log(`🚀 Backend running on port ${port}`);
    console.log('📦 Database configuration:');
    console.log(`   Host: ${dbHost}`);
    console.log(`   Port: ${dbPort}`);
    console.log(`   Name: ${dbName}`);
    console.log('=================================');
  });
}

bootstrap();