import { IsString, IsNotEmpty } from 'class-validator';

export class AsignarProfesionDto {
  @IsString()
  @IsNotEmpty()
  nombreProfesion: string; // Nombre de la profesión (puede ser nuevo o existente)
}