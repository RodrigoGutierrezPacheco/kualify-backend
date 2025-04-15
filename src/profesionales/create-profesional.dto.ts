import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateProfesionalDto{
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(3)
    profesionalname:string;

    @IsString()
    @MinLength(8)
    password:string;
}