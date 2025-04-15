import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profesional } from "./profesional.entity";
import { CreateProfesionalDto } from "./create-profesional.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class ProfesionalService {
  constructor(
    @InjectRepository(Profesional)
    private profesionalRepository: Repository<Profesional>
  ) {}

  //   Crear un nuevo profesional con hash de contraseña
  async create(
    createProfesionalDto: CreateProfesionalDto
  ): Promise<Profesional> {
    const salt = await bcrypt.genSalt();
    const hashesPassword = await bcrypt.hash(
      createProfesionalDto.password,
      salt
    );

    const profesional = this.profesionalRepository.create({
      ...createProfesionalDto,
      password: hashesPassword,
    });
    try {
      return await this.profesionalRepository.save(profesional);
    } catch (error) {
      if (error.code === "23505")
        // Codigo para violacion de unique constraing
        // Ahora solo verifica conflicto de email
        throw new ConflictException("El email ya esta en uso");
    }
    throw new InternalServerErrorException("Error al crear el usuario");
  }

  // Listar todos los usuarios (sin passwords)
  async findAll(): Promise<Profesional[]> {
    try {
      return await this.profesionalRepository.find({
        select: ["id", "email", "profesionalname"], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al listar profesionales: ${error.message}`);
    }
  }

  // Buscar usuario por ID (sin password)
  async findById(id: number): Promise<Profesional | null> {
    try {
      return await this.profesionalRepository.findOne({
        where: { id },
        select: ["id", "email", "profesionalname"], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Actualizar usuario con hashing de password
  async update(
    id: number,
    updateData: Partial<Profesional>
  ): Promise<Profesional> {
    try {
      // Si se está actualizando el password, lo hasheamos
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      await this.profesionalRepository.update(id, updateData);
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

  // Eliminar usuario
  async remove(id: number): Promise<void> {
    try {
      await this.profesionalRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}
