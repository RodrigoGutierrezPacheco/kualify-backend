import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  // Crear un nuevo usuario (con hash de contraseña)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === "23505") {
        // Código para violación de unique constraint
        // Ahora solo verifica conflicto de email
        throw new ConflictException("El email ya está en uso");
      }
      throw new InternalServerErrorException("Error al crear el usuario");
    }
  }

  // Buscar usuario por email (para autenticación)
  async findOne(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { email },
        select: ["id", "email", "password", "role", "username"], // Incluir campos necesarios
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Buscar usuario por email y status true
  async findByEmailAndStatus(email: string): Promise<User | null> {
    try {
      return await this.usersRepository
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .andWhere("user.status = :status", { status: true })
        .getOne();
    } catch (error) {
      throw new Error(
        `Error al buscar usuario por email y status: ${error.message}`
      );
    }
  }

  // Buscar usuario por ID (sin password)
  async findById(id: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({
        where: { id },
        select: ["id", "email", "username", "role"], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  // Listar todos los usuarios (sin passwords)
  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        select: ["id", "email", "username", "role", "status"], // Excluir password
      });
    } catch (error) {
      throw new Error(`Error al listar usuarios: ${error.message}`);
    }
  }

  // Actualizar usuario con hashing de password
  async update(id: string, updateData: Partial<User>): Promise<User> {
    try {
      // Si se está actualizando el password, lo hasheamos
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      await this.usersRepository.update(id, updateData);
      const updatedUser = await this.findById(id.toString());

      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }

      return updatedUser;
    } catch (error) {
      if (error.code === "23505") {
        // Violación de constraint único
        throw new ConflictException("El email ya está en uso");
      }
      throw new InternalServerErrorException("Error al actualizar usuario");
    }
  }
  // Eliminar usuario
  async remove(id: string): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Cambiar status
  async changeStatus(id: string, status: boolean): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      user.status = status;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new Error(
        `Error al cambiar el estado del usuario: ${error.message}`
      );
    }
  }
}
