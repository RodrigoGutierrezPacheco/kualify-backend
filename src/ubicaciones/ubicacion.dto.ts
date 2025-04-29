import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class EstadoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}

export class CiudadDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

}

export class EstadoConCiudadesDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  ciudades: string[]; 
}