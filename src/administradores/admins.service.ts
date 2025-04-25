import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./admin.entity";
import { CreateAdminDto } from "./create-admin.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {}

  //   Crear un nuevo profesional con hash de contraseña
  async create(
    CreateAdminDto: CreateAdminDto
  ): Promise<Admin> {
    const salt = await bcrypt.genSalt();
    const hashesPassword = await bcrypt.hash(
      CreateAdminDto.password,
      salt
    );

    const profesional = this.adminRepository.create({
      ...CreateAdminDto,
      password: hashesPassword,
    });
    try {
      return await this.adminRepository.save(profesional);
    } catch (error) {
      if (error.code === "23505")
        // Codigo para violacion de unique constraing
        // Ahora solo verifica conflicto de email
        throw new ConflictException("El email ya esta en uso");
    }
    throw new InternalServerErrorException("Error al crear el usuario");
  }

  // Listar todos los usuarios (sin passwords)
  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminRepository.find({
        select: ["id", "email", "adminName", "status"	], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al listar profesionales: ${error.message}`);
    }
  }

  // Buscar usuario por ID (sin password)
  async findById(id: number): Promise<Admin | null> {
    try {
      return await this.adminRepository.findOne({
        where: { id },
        select: ["id", "email", "adminName"], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Actualizar usuario con hashing de password
  async update(
    id: number,
    updateData: Partial<Admin>
  ): Promise<Admin> {
    try {
      // Si se está actualizando el password, lo hasheamos
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      await this.adminRepository.update(id, updateData);
      const updatedUser = await this.findById(id);

      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }

      return updatedUser;
    } catch (error) {
      if (error.code === "23505") {
        // Violación de constraint único
        throw new ConflictException("El email ya está en uso");
      }
      throw new InternalServerErrorException("Error al actualizar profesional");
    }
  }

  // Cambiar status
  async changeStatus(id: number, status: boolean): Promise<Admin> {
    try {
      const profesional = await this.findById(id);
      if (!profesional) {
        throw new Error("Profesional no encontrado");
      }
      profesional.status = status;
      return await this.adminRepository.save(profesional);
    } catch (error) {
      throw new Error(
        `Error al cambiar el estado del profesional: ${error.message}`
      );
    }
  }

  // Eliminar usuario
  async remove(id: number): Promise<void> {
    try {
      await this.adminRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}
