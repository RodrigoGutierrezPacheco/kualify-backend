import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
  Res,
  ParseUUIDPipe,
  NotFoundException,
  ConflictException,
  Put,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { AdminService } from "./admins.service";
import { CreateAdminDto } from "./create-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";
import { Response } from "express";
import { Admin } from "./admin.entity";

@ApiTags("Admins")
@Controller("admins")
export class AdminsController {
  constructor(private readonly AdminsService: AdminService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo administrador" })
  @ApiResponse({ status: 201, description: "Administrador creado con éxito" })
  @ApiResponse({ status: 409, description: "Conflicto al crear el administrador" })
  async create(@Body() CreateAdminDto: CreateAdminDto, @Res() res: Response) {
    try {
      const admin = await this.AdminsService.create(CreateAdminDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: "Administrador creado con éxito",
        data: this.sanitizeAdmin(admin),
      });
    } catch (error) {
      const status =
        error instanceof ConflictException
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al crear el administrador",
        error: error.name || "Internal Server Error",
      });
    }
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los administradores" })
  @ApiResponse({ status: 200, description: "Admins obtenidos con éxito" })
  async findAll(@Res() res: Response) {
    try {
      const users = await this.AdminsService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Admins obtenidos con éxito",
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Error al obtener los administradores",
        error: "Internal Server Error",
      });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un administrador por ID" })
  @ApiParam({ name: "id", type: "string", description: "UUID del administrador" })
  @ApiResponse({ status: 200, description: "Administrador obtenido con éxito" })
  @ApiResponse({ status: 404, description: "Administrador no encontrado" })
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const user = await this.AdminsService.findById(id);
      if (!user) {
        throw new NotFoundException("Administrado no encontrado");
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Administrado obtenido con éxito",
        data: user,
      });
    } catch (error) {
      const status =
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al obtener el Administrador",
        error: error.name || "Internal Server Error",
      });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar un administrador por ID" })
  @ApiParam({ name: "id", type: "string", description: "UUID del administrador" })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({ status: 200, description: "Administrador actualizado con éxito" })
  @ApiResponse({ status: 404, description: "Administrador no encontrado" })
  async update(
    @Param("id", ParseUUIDPipe) id: number,
    @Body() updateUserDto: UpdateAdminDto,
    @Res() res: Response
  ) {
    try {
      const updatedUser = await this.AdminsService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Administrado actualizado con éxito",
        data: this.sanitizeAdmin(updatedUser),
      });
    } catch (error) {
      const status = error.message.includes("no encontrado")
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al actualizar el Administrado",
        error: "Internal Server Error",
      });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un administrador por ID" })
  @ApiParam({ name: "id", type: "string", description: "UUID del administrador" })
  @ApiResponse({ status: 200, description: "Administrador eliminado con éxito" })
  @ApiResponse({ status: 500, description: "Error del servidor" })
  async remove(@Param("id", ParseUUIDPipe) id: number, @Res() res: Response) {
    try {
      await this.AdminsService.remove(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Administrador eliminado con éxito",
        data: null,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Error al eliminar el Administrador",
        error: "Internal Server Error",
      });
    }
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Cambiar el estado del administrador" })
  @ApiParam({ name: "id", type: "string", description: "UUID del administrador" })
  @ApiBody({ schema: { type: "object", properties: { status: { type: "boolean" } } } })
  @ApiResponse({ status: 200, description: "Estado actualizado con éxito" })
  @ApiResponse({ status: 404, description: "Administrador no encontrado" })
  async changeStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("status") status: boolean,
    @Res() res: Response
  ) {
    try {
      const updatedAdmin = await this.AdminsService.changeStatus(id, status);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Estado del Administrador actualizado con éxito",
        data: this.sanitizeAdmin(updatedAdmin),
      });
    } catch (error) {
      const status = error.message.includes("no encontrado")
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message:
          error.message || "Error al actualizar el estado del Administrador",
        error: "Internal Server Error",
      });
    }
  }

  private sanitizeAdmin(admin: Admin): Partial<Admin> {
    const { password, ...sanitizeAdmin } = admin;
    return sanitizeAdmin;
  }
}
