import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProfesionalesModule } from "./profesionales/profesionales.module";
import { ClientesModule } from "./clientes/clientes.module";
import { ConfigModule } from "@nestjs/config";
import { AdminsModule } from './administradores/admins.module';
import { CloudinaryModule } from "./cloudinary/cloudinaty.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { UbicacionesModule } from "./ubicaciones/ubicaciones.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,  // Asegúrate que AuthModule exporte JwtModule
    UsersModule,
    ProfesionalesModule,
    ClientesModule,
    AdminsModule,
    CloudinaryModule,
    UbicacionesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,  // Usa APP_GUARD de @nestjs/core en lugar de string
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}