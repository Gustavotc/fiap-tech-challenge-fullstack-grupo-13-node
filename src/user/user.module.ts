import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.schema';
import { Role } from './schemas/role.schema';
import { UserTypeormRepository } from './repository/typeorm/user.typeorm.repository';
import { UserRepository } from './repository/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserTypeormRepository,
    },
  ],
})
export class UserModule {}
