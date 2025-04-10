import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ 
        where: { email },
        select: ['id', 'email', 'password', 'role'] // ¡Importante! Asegúrate de incluir password
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

}