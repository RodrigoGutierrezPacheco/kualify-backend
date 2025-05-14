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
import { DocumentoService } from "./documento-usuario.service";
import { UploadDocumentoDto } from "./upload-documento-usuario.dto";
import { AuditarDocumentoDto } from "./auditar-documento-usuario.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";

@ApiTags('Documentos') // Etiqueta general para los endpoints relacionados con documentos
@Controller("usuarios/:id/documentos")
export class DocumentosController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post()
  @ApiOperation({ summary: 'Sube un nuevo documento para un usuario' })
  @ApiResponse({
    status: 201,
    description: 'Documento subido correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto al subir el documento.',
  })
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
  @ApiOperation({ summary: 'Elimina un documento específico' })
  @ApiParam({
    name: 'documentoId',
    description: 'ID del documento a eliminar',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento no encontrado.',
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
  @ApiOperation({ summary: 'Lista los documentos de un usuario' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario para obtener sus documentos',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos obtenidos correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron documentos para el usuario.',
  })
  async listarDocumentos(@Param("id", ParseUUIDPipe) userId: string) {
    return this.documentoService.obtenerDocumentosPorUsuario(userId);
  }

  @Patch(":documentoId/auditar")
  @ApiOperation({ summary: 'Marca un documento como auditado' })
  @ApiParam({
    name: 'documentoId',
    description: 'ID del documento a auditar',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Documento auditado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud al intentar auditar el documento.',
  })
  async marcarComoAuditado(
    @Param("id", ParseUUIDPipe) userId: string,
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
