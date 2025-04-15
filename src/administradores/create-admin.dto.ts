import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateAdminDto{
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(3)
    adminName:string;

    @IsString()
    @MinLength(8)
    password:string;
}