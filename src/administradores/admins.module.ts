import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminsController } from "./admins.controller";
import { AdminService } from "./admins.service";
import { Admin } from "./admin.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
providers: [AdminService],
  controllers: [AdminsController],
  exports: [AdminService], // Si otros módulos necesitan usar este servicio
})
export class AdminsModule {}
