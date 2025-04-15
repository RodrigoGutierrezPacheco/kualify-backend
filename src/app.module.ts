import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProfesionalesModule } from "./profesionales/profesionales.module";
import { ClientesModule } from "./clientes/clientes.module";
import { ConfigModule } from "@nestjs/config";
import { AdminsModule } from './administradores/admins.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfesionalesModule,
    ClientesModule,
    ConfigModule.forRoot(),
    AdminsModule,
  ],
})
export class AppModule {}
