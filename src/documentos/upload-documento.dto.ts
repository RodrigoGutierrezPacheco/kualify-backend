import { IsIn } from 'class-validator';

const tiposDocumentosValidos = [
  'acta_nacimiento',
  'comprobante_domicilio',
  'constancia_fiscal',
  'ine_pasaporte'
] as const;

export class UploadDocumentoDto {
  @IsIn(tiposDocumentosValidos, {
    message: `El tipo de documento debe ser uno de: ${tiposDocumentosValidos.join(', ')}`
  })
  tipo: typeof tiposDocumentosValidos[number];
}

// audit-documento.dto.ts
export class AuditDocumentoDto {
  id: number;
  auditado: boolean;
  fechaAuditoria?: Date;
  tipo: string;
  url: string;
}