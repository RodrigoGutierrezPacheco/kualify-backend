import { IsNotEmpty, IsString } from 'class-validator';

export class EstadoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}

export class CiudadDto extends EstadoDto {
  @IsNotEmpty()
  @IsString()
  ciudad: string;
}