import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Documento, DocumentoConProfesionalDto } from "./documento.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Profesional } from "src/profesionales/profesional.entity";

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(Documento)
    private documentoRepository: Repository<Documento>,
    @InjectRepository(Profesional)
    private profesionalRepository: Repository<Profesional>,
    private cloudinaryService: CloudinaryService
  ) {}

  async subirDocumento(
    profesionalId: string,
    file: Express.Multer.File,
    tipo: string
  ): Promise<Documento> {
    const profesional = await this.profesionalRepository.findOneBy({
      id: profesionalId,
    });

    if (!profesional) {
      throw new Error("Profesional no encontrado");
    }

    // Validacion para no subir doble documentacion
    const documentoExistente = await this.documentoRepository.findOne({
      where: {
        profesional: {
          id: profesionalId,
        },
        tipo: tipo as any,
      },
    });

    if (documentoExistente) {
      throw new Error("El profesional ya tiene un documento de este tipo");
    }

    // Subir a Cloudinary
    const { url } = await this.cloudinaryService.uploadFile(file);

    // Crear nuevo documento
    const documento = this.documentoRepository.create({
      tipo: tipo as any,
      url,
      auditado: false,
      profesional,
    });

    return this.documentoRepository.save(documento);
  }

  async eliminarDocumento(documentoId: number): Promise<void> {
    // 1. Buscar el documento
    const documento = await this.documentoRepository.findOne({
      where: { id: documentoId },
      relations: ["profesional"],
    });

    if (!documento) {
      throw new NotFoundException("Documento no encontrado");
    }

    // 2. Extraer public_id de Cloudinary (de la URL)
    const urlParts = documento.url.split("/");
    const publicId = urlParts.slice(-2).join("/").split(".")[0];

    // 3. Eliminar de Cloudinary
    try {
      await this.cloudinaryService.deleteFile(publicId);
    } catch (error) {
      console.error("Error eliminando de Cloudinary:", error);
      // Puedes decidir si continuar o lanzar error
    }

    // 4. Eliminar de la base de datos
    await this.documentoRepository.remove(documento);
  }

  async obtenerDocumentosPorProfesional(
    profesionalId: string
  ): Promise<DocumentoConProfesionalDto[]> {
    // Verificar si el profesional existe
    const profesional = await this.profesionalRepository.findOne({
      where: { id: profesionalId },
    });

    if (!profesional) {
      throw new NotFoundException(
        `Profesional con ID ${profesionalId} no existe`
      );
    }

    // Buscar los documentos
    const documentos = await this.documentoRepository.find({
      where: { profesional: { id: profesionalId } },
      relations: ["profesional"],
    });

    if (!documentos || documentos.length === 0) {
      throw new NotFoundException(
        `No se encontraron documentos para el profesional con ID ${profesionalId}`
      );
    }

    // Mapear a DTO
    return documentos.map((documento) => ({
      ...documento,
      profesional: {
        id: documento.profesional.id,
        email: documento.profesional.email,
        profesionalname: documento.profesional.profesionalname,
      },
    }));
  }

  async marcarDocumentoComoAuditado(documentoId: number): Promise<Documento> {
    // Buscar el documento
    const documento = await this.documentoRepository.findOne({
      where: { id: documentoId },
    });

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Actualizar el estado de auditoría
    documento.auditado = true;

    // Guardar los cambios
    return await this.documentoRepository.save(documento);
  }
}
