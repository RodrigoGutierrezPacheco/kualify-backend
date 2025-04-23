import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginProfessionalDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}