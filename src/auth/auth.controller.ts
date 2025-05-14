import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./login-user.dto";
import { LoginProfessionalDto } from "./login-profesional.dto";
import { LoginAdminDto } from "./login-admin.dto";
import { Public } from "./decorators/public.decorator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Autenticación') // Agrupa todos los endpoints bajo esta sección
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login/user")
  @ApiOperation({ 
    summary: 'Inicio de sesión para usuarios',
    description: 'Autentica a un usuario regular y devuelve un token JWT' 
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        user: {
          email: 'usuario@example.com',
          name: 'Juan Pérez'
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
      false
    );
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(user, false);
  }

  @Public()
  @Post("login/professional")
  @ApiOperation({ 
    summary: 'Inicio de sesión para profesionales',
    description: 'Autentica a un profesional y devuelve un token JWT' 
  })
  @ApiBody({ type: LoginProfessionalDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        professional: {
          email: 'profesional@example.com',
          name: 'María García',
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async loginProfessional(@Body() loginProfessionalDto: LoginProfessionalDto) {
    const professional = await this.authService.validateUser(
      loginProfessionalDto.email,
      loginProfessionalDto.password,
      true
    );
    if (!professional) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(professional, true);
  }

  @Public()
  @Post("login/admin")
  @ApiOperation({ 
    summary: 'Inicio de sesión para administradores',
    description: 'Autentica a un administrador y devuelve un token JWT' 
  })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        admin: {
          email: 'admin@example.com',
          name: 'Admin',
        }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async loginAdmin(@Body() loginProfessionalDto: LoginAdminDto) {
    const admin = await this.authService.validateUser(
      loginProfessionalDto.email,
      loginProfessionalDto.password,
      true
    );
    if (!admin) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.authService.login(admin, true);
  }
}