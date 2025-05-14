import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = process.env.PORT || 5000;
  const dbHost = configService.get<string>("DB_HOST");
  const dbPort = configService.get<number>("DB_PORT");
  const dbName = configService.get<string>("DB_NAME");

  const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "https://kualify-tau.vercel.app/"];

  // Configuración de CORS
  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Kualify API')
    .setDescription('API completa para la plataforma Kualify')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT',
        in: 'header',
      },
      'JWT-auth', // Este nombre debe coincidir con el usado en @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token en sesión
      tagsSorter: 'alpha', // Ordena los tags alfabéticamente
      operationsSorter: 'alpha', // Ordena las operaciones alfabéticamente
    },
    customSiteTitle: 'Kualify API Documentation',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    })
  );

  await app.listen(port, () => {
    console.log("=================================");
    console.log(`🚀 Backend running on port ${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    console.log("📦 Database configuration:");
    console.log(`   Host: ${dbHost}`);
    console.log(`   Port: ${dbPort}`);
    console.log(`   Name: ${dbName}`);
    console.log("=================================");
  });
}

bootstrap();