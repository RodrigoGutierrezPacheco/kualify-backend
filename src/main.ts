import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from '@nestjs/common'; // Importa ValidationPipe

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

  // Agrega el ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Elimina propiedades no incluidas en el DTO
      forbidNonWhitelisted: true,    // Rechaza requests con propiedades no permitidas
      transform: true,               // Transforma los tipos automáticamente
      disableErrorMessages: false,   // Habilita mensajes de error detallados
    })
  );

  await app.listen(port, () => {
    console.log("=================================");
    console.log(`🚀 Backend running on port ${port}`);
    console.log("📦 Database configuration:");
    console.log(`   Host: ${dbHost}`);
    console.log(`   Port: ${dbPort}`);
    console.log(`   Name: ${dbName}`);
    console.log("=================================");
  });
}

bootstrap();