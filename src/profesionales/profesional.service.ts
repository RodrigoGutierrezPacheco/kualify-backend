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
import { AsignarProfesionDto } from "./asignar-profesion.dto";
import * as bcrypt from "bcrypt";
import { OpenaiService } from "../openai/openai.service";
import { Profession } from "./../professions/professions.entity";

@Injectable()
export class ProfesionalService {
  constructor(
    @InjectRepository(Profesional)
    private profesionalRepository: Repository<Profesional>,
    @InjectRepository(Profession)
    private profesionRepository: Repository<Profession>,
    private openaiService: OpenaiService
  ) {}

  // Crear un nuevo profesional con hash de contraseña
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
        if (
          error.detail?.includes("email") ||
          error.constraint?.includes("email")
        ) {
          throw new ConflictException("El email ya está en uso");
        } else if (
          error.detail?.includes("phone") ||
          error.detail?.includes("teléfono") ||
          error.detail?.includes("telefono") ||
          error.constraint?.includes("phone")
        ) {
          throw new ConflictException("El número de teléfono ya está en uso");
        }
        throw new ConflictException(
          "El valor proporcionado ya existe en otro profesional"
        );
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
        ],
        relations: ["profesion"], // Incluir relación con profesión
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al listar profesionales: ${error.message}`
      );
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
          "especialidades",
        ],
        relations: ["profesion"], // Incluir relación con profesión
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar usuario: ${error.message}`
      );
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
        throw new NotFoundException("Profesional no encontrado");
      }

      return updatedUser;
    } catch (error) {
      if (error.code === "23505") {
        if (
          error.detail?.includes("email") ||
          error.constraint?.includes("email")
        ) {
          throw new ConflictException("El email ya está en uso");
        } else if (
          error.detail?.includes("phone") ||
          error.constraint?.includes("phone")
        ) {
          throw new ConflictException("El teléfono ya está en uso");
        }
        throw new ConflictException(
          "El valor proporcionado ya existe en otro profesional"
        );
      }
      throw new InternalServerErrorException("Error al actualizar profesional");
    }
  }

  // Eliminar usuario
  async remove(id: number): Promise<void> {
    try {
      const result = await this.profesionalRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException("Profesional no encontrado");
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar usuario: ${error.message}`
      );
    }
  }

  // Cambiar status
  async changeStatus(id: string, status: boolean): Promise<Profesional> {
    try {
      const profesional = await this.profesionalRepository.findOneBy({ id });
      if (!profesional) {
        throw new NotFoundException("Profesional no encontrado");
      }
      profesional.status = status;
      return await this.profesionalRepository.save(profesional);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al cambiar estado: ${error.message}`
      );
    }
  }

  async audit(id: string, auditado: boolean): Promise<Profesional> {
    try {
      const profesional = await this.profesionalRepository.findOneBy({ id });
      if (!profesional) {
        throw new NotFoundException("Profesional no encontrado");
      }
      profesional.auditado = auditado;
      return this.profesionalRepository.save(profesional);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al auditar: ${error.message}`
      );
    }
  }

  // Buscar profesional por email (incluyendo password para validación)
  async findByEmail(email: string): Promise<Profesional | null> {
    try {
      return await this.profesionalRepository
        .createQueryBuilder("profesional")
        .where("profesional.email = :email", { email })
        .addSelect("profesional.password")
        .leftJoinAndSelect("profesional.profesion", "profesion") // Incluir profesión
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar por email: ${error.message}`
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
        .leftJoinAndSelect("profesional.profesion", "profesion") // Incluir profesión
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar por email y status: ${error.message}`
      );
    }
  }

  // Asignar o crear profesión para un profesional
  async asignarOcrearProfesion(
    profesionalId: string,
    asignarDto: AsignarProfesionDto
  ): Promise<Profesional> {
    try {
      // 1. Verificar que el profesional existe
      const profesional = await this.profesionalRepository.findOne({
        where: { id: profesionalId },
        relations: ["profesion"],
      });

      if (!profesional) {
        throw new NotFoundException("Profesional no encontrado");
      }

      // 2. Buscar profesión existente (insensible a mayúsculas y sin espacios extras)
      const nombreProfesion = asignarDto.nombreProfesion.trim().toLowerCase();
      let profesion = await this.profesionRepository
        .createQueryBuilder("profesion")
        .where("LOWER(TRIM(profesion.standardizedName)) = :standardizedName", {
          standardizedName: nombreProfesion,
        })
        .getOne();

      // 3. Si no existe, crear nueva profesión sanitizada
      if (!profesion) {
        const sanitized = await this.openaiService.standardizeProfession(
          asignarDto.nombreProfesion
        );

        // Validar respuesta de OpenAI
        if (!sanitized?.standardized) {
          throw new InternalServerErrorException(
            "No se pudo estandarizar la profesión"
          );
        }

        profesion = this.profesionRepository.create({
          standardizedName: sanitized.standardized,
          tags: sanitized.tags || [],
          category: sanitized.category || "General",
        });

        try {
          await this.profesionRepository.save(profesion);
        } catch (error) {
          throw new InternalServerErrorException(
            "Error al guardar la nueva profesión"
          );
        }
      }

      // 4. Asignar profesión al profesional
      profesional.profesion = profesion;
      return await this.profesionalRepository.save(profesional);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al asignar profesión: ${error.message}`
      );
    }
  }

  // Asignar especialidades para el profesional
  async asignarEspecialidades(
    id: string,
    especialidades: string[]
  ): Promise<Profesional> {
    try {
      const profesional = await this.profesionalRepository.findOneBy({ id });
      if (!profesional) {
        throw new NotFoundException("Profesional no encontrado");
      }
      profesional.especialidades = especialidades;
      return await this.profesionalRepository.save(profesional);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al asignar especialidades: ${error.message}`
      );
    }
  }
}
