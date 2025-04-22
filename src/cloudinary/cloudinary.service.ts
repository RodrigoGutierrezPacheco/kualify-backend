import { Injectable, Logger } from "@nestjs/common";
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      this.logger.log(`Subiendo archivo: ${file.originalname} (${file.mimetype})`);
      
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      // Configuración con tipos correctos
      const uploadOptions: UploadApiOptions = {
        folder: "Kualify",
        resource_type: "auto", // Usamos el tipo literal "auto" en lugar de string
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx"],
        format: file.mimetype.split('/')[1],
      };

      const result: UploadApiResponse = await cloudinary.uploader.upload(dataURI, uploadOptions);

      this.logger.log(`Archivo subido exitosamente: ${result.public_id}`);
      
      return { 
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      this.logger.error(`Error al subir archivo: ${error.message}`);
      throw new Error(`Error al subir el archivo: ${error.message}`);
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      this.logger.log(`Eliminando archivo: ${publicId}`);
      
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result !== "ok") {
        throw new Error(`Cloudinary respondió con estado: ${result.result}`);
      }
      
      this.logger.log(`Archivo eliminado exitosamente: ${publicId}`);
    } catch (error) {
      this.logger.error(`Error al eliminar archivo: ${error.message}`);
      throw new Error(`Error al eliminar el archivo: ${error.message}`);
    }
  }
}