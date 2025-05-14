import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuditarDocumentoDto {
  @ApiProperty({
    description: 'Comentario sobre el documento auditado.',
    example: 'Este documento está en regla.',
  })
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @ApiProperty({
    description: 'Indica si el documento ha sido auditado o no.',
    example: true,
  })
  @IsBoolean()
  auditado: boolean;
}
