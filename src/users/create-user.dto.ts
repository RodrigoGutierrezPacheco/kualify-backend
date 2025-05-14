import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from "class-validator";
import {
  ApiProperty,
  ApiPropertyOptional,
} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "usuario@example.com", description: "Correo electrónico del usuario" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "5512345678", description: "Número de teléfono con al menos 10 caracteres" })
  @IsString()
  @MinLength(10)
  phoneNumber: string;

  @ApiProperty({ example: "usuario123", description: "Nombre de usuario (mínimo 3 caracteres)" })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiPropertyOptional({ example: "México", description: "País de origen" })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiPropertyOptional({ example: "1990-01-01", description: "Fecha de nacimiento (YYYY-MM-DD)" })
  @IsOptional()
  @IsString() // Usar IsDateString si se requiere formato ISO
  fecha_nacimiento?: string;

  @ApiPropertyOptional({
    example: "masculino",
    description: "Género del usuario",
    enum: ["masculino", "femenino", "otro", ""],
  })
  @IsOptional()
  @IsString()
  @IsIn(["masculino", "femenino", "otro", ""])
  genero?: string;

  @ApiPropertyOptional({ example: "Ciudad de México", description: "Estado o provincia" })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional({ example: "Benito Juárez", description: "Ciudad o municipio" })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiProperty({ example: "Segura123", description: "Contraseña del usuario (mínimo 8 caracteres)" })
  @IsString()
  @MinLength(8)
  password: string;
}
