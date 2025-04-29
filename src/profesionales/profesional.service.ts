import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
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
    const hashedPassword = await bcrypt.hash(
      createProfesionalDto.password,
      salt
    );

    const profesional = this.profesionalRepository.create({
      ...createProfesionalDto,
      password: hashedPassword,
    });

    try {
      return await this.profesionalRepository.save(profesional);
    } catch (error) {
      if (error.code === "23505") {
        // Analizamos el error para determinar qué campo causó la violación
        const errorDetail = error.detail || error.message;

        if (
          errorDetail.includes("email") ||
          error.constraint?.includes("email")
        ) {
          throw new ConflictException("El email ya está en uso");
        } else if (
          errorDetail.includes("phone") ||
          errorDetail.includes("teléfono") ||
          errorDetail.includes("telefono") ||
          error.constraint?.includes("phone")
        ) {
          throw new ConflictException("El número de teléfono ya está en uso");
        } else {
          // Mensaje genérico si no podemos determinar el campo
          throw new ConflictException(
            "El valor proporcionado ya existe en otro profesional"
          );
        }
      }
      throw new InternalServerErrorException("Error al crear el profesional");
    }
  }

  // Listar todos los usuarios (sin passwords)
  async findAll(): Promise<Profesional[]> {
    try {
      return await this.profesionalRepository.find({
        select: [
          "id",
          "email",
          "profesionalname",
          "status",
          "auditado",
          "phoneNumber",
        ], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al listar profesionales: ${error.message}`);
    }
  }

  // Buscar usuario por ID (sin password)
  async findById(id: string): Promise<Profesional | null> {
    try {
      return await this.profesionalRepository.findOne({
        where: { id },
        select: [
          "id",
          "email",
          "profesionalname",
          "status",
          "auditado",
          "phoneNumber",
          "ciudad",
          "estado",
          "genero",
          "fecha_nacimiento",	
          "pais",
        ], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Actualizar usuario con hashing de password
  async update(
    id: string,
    updateData: Partial<Profesional>
  ): Promise<Profesional> {
    try {
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      await this.profesionalRepository.update(id, updateData);
      const updatedUser = await this.findById(id);

      if (!updatedUser) {
        throw new Error("Profesional no encontrado");
      }

      return updatedUser;
    } catch (error) {
      if (error.code === "23505") {
        // Analizamos el error para determinar qué campo causó la violación
        const errorMessage = error.detail || error.message;

        if (errorMessage.includes("email")) {
          throw new ConflictException(
            "El email ya está en uso por otro profesional"
          );
        } else if (
          errorMessage.includes("phone") ||
          errorMessage.includes("teléfono") ||
          errorMessage.includes("telefono")
        ) {
          throw new ConflictException(
            "El número de teléfono ya está en uso por otro profesional"
          );
        } else if (error.constraint === "profesional_email_key") {
          // Nombre específico de constraint para email
          throw new ConflictException("El email ya está en uso");
        } else if (error.constraint === "profesional_phoneNumber_key") {
          // Nombre específico de constraint para teléfono
          throw new ConflictException("El teléfono ya está en uso");
        } else {
          // Mensaje genérico si no podemos determinar el campo
          throw new ConflictException(
            "El valor proporcionado ya existe en otro profesional"
          );
        }
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

  // Cambiar status
  async changeStatus(id: string, status: boolean): Promise<Profesional> {
    try {
      const profesional = await this.findById(id);
      if (!profesional) {
        throw new Error("Profesional no encontrado");
      }
      profesional.status = status;
      return await this.profesionalRepository.save(profesional);
    } catch (error) {
      throw new Error(
        `Error al cambiar el estado del profesional: ${error.message}`
      );
    }
  }

  async audit(id: string, auditado: boolean): Promise<Profesional> {
    const profesional = await this.profesionalRepository.findOneBy({ id });

    if (!profesional) {
      throw new NotFoundException("Profesional no encontrado");
    }

    profesional.auditado = auditado;
    return this.profesionalRepository.save(profesional);
  }

  // Buscar profesional por email (incluyendo password para validación)
  async findByEmail(email: string): Promise<Profesional | null> {
    try {
      return await this.profesionalRepository
        .createQueryBuilder("profesional")
        .where("profesional.email = :email", { email })
        .addSelect("profesional.password") // Incluir el campo password que normalmente se excluye
        .getOne();
    } catch (error) {
      throw new Error(
        `Error al buscar profesional por email: ${error.message}`
      );
    }
  }

  // Buscar profesional por email y status true
  async findByEmailAndStatus(email: string): Promise<Profesional | null> {
    try {
      return await this.profesionalRepository
        .createQueryBuilder("profesional")
        .where("profesional.email = :email", { email })
        .andWhere("profesional.status = :status", { status: true })
        .getOne();
    } catch (error) {
      throw new Error(
        `Error al buscar profesional por email y status: ${error.message}`
      );
    }
  }
}
