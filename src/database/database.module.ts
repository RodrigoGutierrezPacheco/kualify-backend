import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'alamierda',
      database: 'kualify_db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // ¡OJO! Solo en desarrollo.
    }),
  ],
})
export class DatabaseModule {}