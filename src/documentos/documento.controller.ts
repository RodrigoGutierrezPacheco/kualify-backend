import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Body,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Delete,
  Get,
  Patch, // Nuevo decorador para operaciones de actualización parcial
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentoService } from "./documento.service";
import { UploadDocumentoDto } from "./upload-documento.dto";

@Controller("profesionales/:id/documentos")
export class DocumentosController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    })
  )
  async uploadDocumento(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentoDto
  ) {
    try {
      return await this.documentoService.subirDocumento(id, file, dto.tipo);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":documentoId")
  async eliminarDocumento(
    @Param("documentoId", ParseIntPipe) documentoId: number
  ) {
    try {
      await this.documentoService.eliminarDocumento(documentoId);
      return { message: "Documento eliminado correctamente" };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException("Error al eliminar el documento");
    }
  }

  @Get()
  async listarDocumentos(@Param("id", ParseIntPipe) profesionalId: number) {
    return this.documentoService.obtenerDocumentosPorProfesional(profesionalId);
  }

  @Patch(":documentoId/auditar") // Nuevo endpoint para marcar como auditado
  async marcarComoAuditado(
    @Param("id", ParseIntPipe) profesionalId: number,
    @Param("documentoId", ParseIntPipe) documentoId: number
  ) {
    try {
      return await this.documentoService.marcarDocumentoComoAuditado(documentoId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Error al actualizar el estado de auditoría");
    }
  }
}