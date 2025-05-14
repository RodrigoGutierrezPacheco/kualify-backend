import { Injectable, NotFoundException ,BadRequestException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Documento, DocumentoConUsuarioDto } from "./documento-usuario.entity";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { User } from "src/users/user.entity";

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(Documento)
    private documentoRepository: Repository<Documento>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService
  ) {}

  // Se suben los archivos, si se encuentra un archivo ya existente se sustituye y elimina el anterior
  async subirDocumento(
    userId: string,
    file: Express.Multer.File,
    tipo: string
  ): Promise<Documento> {
    const usuario = await this.userRepository.findOneBy({
      id: userId,
    });
  
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
  
    // Buscar documento existente
    const documentoExistente = await this.documentoRepository.findOne({
      where: {
        usuario: {
          id: userId,
        },
        tipo: tipo as any,
      },
    });
  
    // Subir a Cloudinary (o tu servicio de almacenamiento)
    const { url } = await this.cloudinaryService.uploadFile(file);
  
    // Si existe un documento previo
    if (documentoExistente) {
      // 1. Eliminar el archivo antiguo de Cloudinary
      try {
        await this.cloudinaryService.deleteFile(documentoExistente.url);
      } catch (error) {
        console.error('Error al eliminar archivo antiguo:', error);
        // Puedes decidir si quieres continuar o lanzar el error
      }
  
      // 2. Actualizar el documento existente
      documentoExistente.url = url;
      documentoExistente.auditado = false; // Resetear estado de verificación
      documentoExistente.fecha_subida = new Date();
      
      return this.documentoRepository.save(documentoExistente);
    }
  
    // Si no existe, crear nuevo documento
    const documento = this.documentoRepository.create({
      tipo: tipo as any,
      url,
      auditado: false,
      usuario,
    });
  
    return this.documentoRepository.save(documento);
  }

  async eliminarDocumento(documentoId: string): Promise<void> {
    // 1. Buscar el documento
    const documento = await this.documentoRepository.findOne({
      where: { id: documentoId },
      relations: ["usuario"],
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

  async obtenerDocumentosPorUsuario(
    usuarioId: string
  ): Promise<DocumentoConUsuarioDto[]> {
    // Verificar si el usuario existe
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con ID ${usuarioId} no existe`
      );
    }

    // Buscar los documentos
    const documentos = await this.documentoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ["usuario"],
    });

    if (!documentos || documentos.length === 0) {
      throw new NotFoundException(
        `No se encontraron documentos para el usuario con ID ${usuarioId}`
      );
    }

    // Mapear a DTO
    return documentos.map((documento) => ({
      ...documento,
      usuario: {
        id: documento.usuario.id,
        email: documento.usuario.email,
        username: documento.usuario.username,
      },
    }));
  }

  async marcarDocumentoComoAuditado(documentoId: string, comentario:string, auditado: boolean): Promise<Documento> {
    // Buscar el documento
    const documento = await this.documentoRepository.findOne({
      where: { id: documentoId },
    });

    if (!documento) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Actualizar el estado de auditoría
    documento.auditado = auditado;
    documento.comentario = comentario

    // Guardar los cambios
    return await this.documentoRepository.save(documento);
  }
}
