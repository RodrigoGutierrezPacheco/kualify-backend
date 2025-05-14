import { IsString, IsNotEmpty, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuditarDocumentoDto {
  @ApiProperty({
    description: 'Comentario que explica el estado de la auditoría del documento.',
    example: 'Documento revisado y aprobado.',
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
