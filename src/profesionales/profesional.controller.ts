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
  Query,
  ParseUUIDPipe,
  NotFoundException,
  ConflictException,
  Put,
} from "@nestjs/common";
import { ProfesionalService } from "./profesional.service";
import { CreateProfesionalDto } from "./create-profesional.dto";
import { UptateProfesionalDto } from "./update-profesional.dto";
import { Response } from "express";
import { Profesional } from "./profesional.entity";
import { Public } from "src/auth/decorators/public.decorator";
import { AsignarProfesionDto } from "./asignar-profesion.dto";

@Controller("profesionals")
export class ProfesionalsController {
  constructor(private readonly profesionalsService: ProfesionalService) {}

  @Public()
  @Post()
  async create(
    @Body() createProfesionalDto: CreateProfesionalDto,
    @Res() res: Response
  ) {
    try {
      const profesional = await this.profesionalsService.create(
        createProfesionalDto
      );
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: "Profesional creado con éxito",
        data: this.sanitizeProfesional(profesional),
      });
    } catch (error) {
      const status =
        error instanceof ConflictException
          ? HttpStatus.CONFLICT
          : HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al crear el profesional",
        error: error.name || "Internal Server Error",
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.profesionalsService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Profesionales obtenidos con éxito",
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Error al obtener los profesionales",
        error: "Internal Server Error",
      });
    }
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const user = await this.profesionalsService.findById(id);
      if (!user) {
        throw new NotFoundException("Profesional no encontrado");
      }
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Profesional obtenido con éxito",
        data: user,
      });
    } catch (error) {
      const status =
        error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al obtener el profesional",
        error: error.name || "Internal Server Error",
      });
    }
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateUserDto: UptateProfesionalDto,
    @Res() res: Response
  ) {
    try {
      const updatedUser = await this.profesionalsService.update(
        id,
        updateUserDto
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Profesional actualizado con éxito",
        data: this.sanitizeProfesional(updatedUser),
      });
    } catch (error) {
      const status = error.message.includes("no encontrado")
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(status).json({
        statusCode: status,
        message: error.message || "Error al actualizar el Profesional",
        error: "Internal Server Error",
      });
    }
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: number, @Res() res: Response) {
    try {
      await this.profesionalsService.remove(id);
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
  async changeStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("status") status: boolean,
    @Res() res: Response
  ) {
    try {
      const profesional = await this.profesionalsService.changeStatus(
        id,
        status
      );
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "Estado del profesional actualizado con éxito",
        data: profesional,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || "Error al cambiar el estado del profesional",
        error: "Internal Server Error",
      });
    }
  }

  @Put(':id/auditar')
  async audit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('auditado') auditado: boolean,
    @Res() res: Response,
  ) {
    try {
      const profesional = await this.profesionalsService.audit(id, auditado);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Profesional auditado con éxito',
        data: profesional,
      });
    } catch (error) {
      const statusCode =
        error.message.includes('no encontrado') || error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(statusCode).json({
        statusCode,
        message: error.message || 'Error al auditar el profesional',
        error: error.name || 'Internal Server Error',
      });
    }
  }

  // Agregar una profesion a un profesional
  @Post(':id/profesion')
  async asignarProfesion(
    @Param('id') id: string,
    @Body() asignarDto: AsignarProfesionDto
  ) {
    return this.profesionalsService.asignarOcrearProfesion(id, asignarDto);
  }

  // Asignar especialidades a un profesional
  @Post(':id/especialidades')
  async asignarEspecialidades(
    @Param('id') id: string,
    @Body() especialidades: string[],
    @Res() res: Response,
  ) {
    const profesional = await this.profesionalsService.asignarEspecialidades(id, especialidades);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Especialidades asignadas con éxito',
      data:especialidades,
    });
  }

  // Método para eliminar información sensible antes de enviar al cliente
  private sanitizeProfesional(profesional: Profesional): Partial<Profesional> {
    const { password, ...sanitizeProfesional } = profesional;
    return sanitizeProfesional;
  }
}
