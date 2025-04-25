import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ProfesionalService } from 'src/profesionales/profesional.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private professionalsService: ProfesionalService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string, isProfessional: boolean): Promise<any> {
    let user;
    if (isProfessional) {
      user = await this.professionalsService.findByEmailAndStatus(email);
    } else {
      user = await this.usersService.findByEmailAndStatus(email);
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, isProfessional: boolean) {
    const payload = { 
      email: user.email, 
      id: user.id,
      role: isProfessional ? 'professional' : 'user'
    };
    return {
      access_token: this.jwtService.sign(payload),
      status: 200
    };
  }

  async loginAdmin(user: any) {
    const payload = { 
      email: user.email, 
      id: user.id,
      role: 'admin'
    };
    return {
      access_token: this.jwtService.sign(payload),
      status: 200
    };
  }
}