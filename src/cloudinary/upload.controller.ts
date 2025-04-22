import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Uploads') // Para Swagger/OpenAPI
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Subir un archivo (imagen o PDF)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir (formatos permitidos: jpg, png, pdf)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente' })
  @ApiResponse({ status: 400, description: 'Archivo inválido o muy grande' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
        exceptionFactory: (error) => {
          throw new BadRequestException(
            error === 'MaxFileSizeValidator'
              ? 'El archivo es demasiado grande (máximo 5MB)'
              : 'Formato de archivo no válido (solo jpg, png, pdf)',
          );
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No se proporcionó ningún archivo');
      }

      const result = await this.cloudinaryService.uploadFile(file);
      
      return {
        status: 'success',
        message: 'Archivo subido correctamente',
        data: {
          url: result.url,
          public_id: result.public_id,
          format: file.mimetype.split('/')[1],
          size: file.size,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al subir el archivo: ${error.message}`,
      );
    }
  }
}