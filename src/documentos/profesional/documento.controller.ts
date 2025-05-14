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
  Patch,
  ParseIntPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { DocumentoService } from "./documento.service";
import { UploadDocumentoDto } from "./upload-documento.dto";
import { AuditarDocumentoDto } from "./auditar-documento.dto";
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";

@Controller("profesionales/:id/documentos")
export class DocumentosController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    })
  )
  @ApiOperation({ summary: 'Sube un documento para un profesional.' })
  @ApiResponse({
    status: 201,
    description: 'Documento subido correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al subir el documento.',
  })
  @ApiBody({
    description: 'Los datos del documento a subir.',
    type: UploadDocumentoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del profesional al que se le asociará el documento.',
    type: String,
  })
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
  @ApiOperation({ summary: 'Elimina un documento por su ID.' })
  @ApiResponse({
    status: 200,
    description: 'Documento eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado.',
  })
  @ApiParam({
    name: 'documentoId',
    description: 'ID del documento a eliminar.',
    type: String,
  })
  async eliminarDocumento(
    @Param("documentoId", ParseIntPipe) documentoId: string
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
  @ApiOperation({ summary: 'Lista los documentos de un profesional.' })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos obtenida correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesional no encontrado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del profesional para obtener sus documentos.',
    type: String,
  })
  async listarDocumentos(@Param("id", ParseUUIDPipe) profesionalId: string) {
    return this.documentoService.obtenerDocumentosPorProfesional(profesionalId);
  }

  @Patch(":documentoId/auditar")
  @ApiOperation({ summary: 'Marca un documento como auditado.' })
  @ApiResponse({
    status: 200,
    description: 'Documento auditado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al actualizar el estado de auditoría.',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado.',
  })
  @ApiParam({
    name: 'documentoId',
    description: 'ID del documento a auditar.',
    type: String,
  })
  async marcarComoAuditado(
    @Param("id", ParseUUIDPipe) profesionalId: string,
    @Param("documentoId") documentoId: string,
    @Body() body: AuditarDocumentoDto
  ) {
    if (!body.comentario) {
      throw new BadRequestException("El comentario es obligatorio");
    }
    try {
      return await this.documentoService.marcarDocumentoComoAuditado(documentoId, body.comentario, body.auditado);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Error al actualizar el estado de auditoría");
    }
  }
}
