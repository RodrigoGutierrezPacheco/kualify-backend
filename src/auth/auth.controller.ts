import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./login-user.dto";
import { LoginProfessionalDto } from "./login-profesional.dto";
import { LoginAdminDto } from "./login-admin.dto";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login/user")
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
