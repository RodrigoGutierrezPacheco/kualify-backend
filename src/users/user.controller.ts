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
  ParseUUIDPipe,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { Response } from "express";
import { User } from "./user.entity";
import { Public } from "src/auth/decorators/public.decorator";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado con éxito" })
  @ApiResponse({ status: 409, description: "Conflicto al crear el usuario" })
  @ApiBody({ type: CreateUserDto })
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
  @ApiOperation({ summary: "Obtener todos los usuarios" })
  @ApiResponse({ status: 200, description: "Usuarios obtenidos con éxito" })
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
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiParam({ name: "id", description: "ID del usuario", type: String })
  @ApiResponse({ status: 200, description: "Usuario obtenido con éxito" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Res() res: Response) {
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
  @ApiOperation({ summary: "Actualizar un usuario" })
  @ApiParam({ name: "id", description: "ID del usuario", type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: "Usuario actualizado con éxito" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
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
  @ApiOperation({ summary: "Eliminar un usuario por ID" })
  @ApiParam({ name: "id", description: "ID del usuario", type: String })
  @ApiResponse({ status: 200, description: "Usuario eliminado con éxito" })
  async remove(@Param("id", ParseUUIDPipe) id: string, @Res() res: Response) {
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

  @Put(":id/status")
  @ApiOperation({ summary: "Cambiar el estado del usuario" })
  @ApiParam({ name: "id", description: "ID del usuario", type: String })
  @ApiBody({ schema: { example: { status: true } } })
  @ApiResponse({ status: 200, description: "Estado del usuario actualizado con éxito" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  async changeStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("status") status: boolean,
    @Res() res: Response
  ) {
    try {
      const updatedUser = await this.usersService.changeStatus(id, status);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Estado del usuario actualizado con éxito",
        data: this.sanitizeUser(updatedUser),
      });
    } catch (error) {
      const statusCode =
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        statusCode,
        message: error.message || "Error al cambiar el estado del usuario",
        error: error.name || "Internal Server Error",
      });
    }
  }

  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
