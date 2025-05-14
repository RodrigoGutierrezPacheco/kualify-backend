import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const tiposDocumentosValidos = [
  'acta_nacimiento',
  'comprobante_domicilio',
  'constancia_fiscal',
  'ine_pasaporte',
  'profile_image',
] as const;

export class UploadDocumentoDto {
  @ApiProperty({
    description: 'El tipo de documento que se va a subir. Este campo es obligatorio.',
    example: 'acta_nacimiento',
    enum: tiposDocumentosValidos, // Aquí Swagger generará un listado de valores posibles
    enumName: 'TipoDocumento', // Nombre del enum, es útil para representar mejor el conjunto de valores
    required: true, // Indica que este campo es obligatorio
  })
  @IsIn(tiposDocumentosValidos, {
    message: `El tipo de documento debe ser uno de: ${tiposDocumentosValidos.join(', ')}`,
  })
  tipo: typeof tiposDocumentosValidos[number]; // Especifica que 'tipo' debe ser uno de los valores definidos en el array 'tiposDocumentosValidos'
}
