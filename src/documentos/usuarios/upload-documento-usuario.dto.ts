import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const tiposDocumentosValidos = [
  'acta_nacimiento',
  'comprobante_domicilio',
  'constancia_fiscal',
  'ine_pasaporte',
  'profile_image'
] as const;

export class UploadDocumentoDto {
  @ApiProperty({
    description: `Tipo de documento. Debe ser uno de: ${tiposDocumentosValidos.join(', ')}`,
    example: 'acta_nacimiento',
    enum: tiposDocumentosValidos, // Enumeración de los tipos de documentos válidos
  })
  @IsIn(tiposDocumentosValidos, {
    message: `El tipo de documento debe ser uno de: ${tiposDocumentosValidos.join(', ')}`,
  })
  tipo: typeof tiposDocumentosValidos[number];
}
