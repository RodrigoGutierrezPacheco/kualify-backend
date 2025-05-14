import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The email of the admin.',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the admin.',
    example: 'Admin User',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  adminName: string;

  @ApiProperty({
    description: 'The password of the admin.',
    example: 'strongpassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
