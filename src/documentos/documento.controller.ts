import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
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
    @Param("id", ParseUUIDPipe) id: string,
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
    @Param("documentoId", ParseUUIDPipe) documentoId: number
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
  async listarDocumentos(@Param("id", ParseUUIDPipe) profesionalId: number) {
    return this.documentoService.obtenerDocumentosPorProfesional(profesionalId.toString());
  }

  @Patch(":documentoId/auditar") // Nuevo endpoint para marcar como auditado
  async marcarComoAuditado(
    @Param("id", ParseUUIDPipe) profesionalId: number,
    @Param("documentoId", ParseUUIDPipe) documentoId: number
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