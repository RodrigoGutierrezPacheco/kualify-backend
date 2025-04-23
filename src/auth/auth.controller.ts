import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user.dto';
import { LoginProfessionalDto } from './login-profesional.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
      false,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user, false);
  }

  @Post('login/professional')
  async loginProfessional(@Body() loginProfessionalDto: LoginProfessionalDto) {
    const professional = await this.authService.validateUser(
      loginProfessionalDto.email,
      loginProfessionalDto.password,
      true,
    );
    if (!professional) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(professional, true);
  }
}