import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Put,
  HttpStatus,
  Res,
  Query,
  ParseIntPipe,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { Response } from "express";
import { User } from "./user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: "Usuario creado con éxito",
        data: this.sanitizeUser(user),
      });
    } catch (error) {
      const status =
        error instanceof ConflictException
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al crear el usuario",
        error: error.name || "Internal Server Error",
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Usuarios obtenidos con éxito",
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Error al obtener los usuarios",
        error: "Internal Server Error",
      });
    }
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const user = await this.usersService.findById(id);
      if (!user) {
        throw new NotFoundException("Usuario no encontrado");
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Usuario obtenido con éxito",
        data: user,
      });
    } catch (error) {
      const status =
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al obtener el usuario",
        error: error.name || "Internal Server Error",
      });
    }
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response
  ) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Usuario actualizado con éxito",
        data: this.sanitizeUser(updatedUser),
      });
    } catch (error) {
      const status = error.message.includes("no encontrado")
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al actualizar el usuario",
        error: "Internal Server Error",
      });
    }
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number, @Res() res: Response) {
    try {
      await this.usersService.remove(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Usuario eliminado con éxito",
        data: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Error al eliminar el usuario",
        error: "Internal Server Error",
      });
    }
  }

  // Metodo para cambiar el status
  @Put(':id/status') 
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: boolean,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.usersService.changeStatus(id, status);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Estado del usuario actualizado con éxito',
        data: this.sanitizeUser(updatedUser),
      });
    } catch (error) {
      const statusCode =
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        statusCode,
        message: error.message || 'Error al cambiar el estado del usuario',
        error: error.name || 'Internal Server Error',
      });
    }
  }

  // Método para eliminar información sensible antes de enviar al cliente
  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
