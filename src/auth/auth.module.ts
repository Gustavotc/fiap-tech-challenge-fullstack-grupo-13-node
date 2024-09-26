import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/schemas/user.schema';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { UserTypeormRepository } from 'src/user/repository/typeorm/user.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UserRepository,
      useClass: UserTypeormRepository,
    },
  ],
})
export class AuthModule {}
