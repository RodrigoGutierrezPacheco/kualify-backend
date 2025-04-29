import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class AuditarDocumentoDto {
    @IsString()
    @IsNotEmpty()
    comentario: string;
  
    @IsBoolean()
    auditado: boolean;
  }