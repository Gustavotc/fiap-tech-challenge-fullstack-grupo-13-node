import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { UserTypeormRepository } from 'src/user/repository/typeorm/user.typeorm.repository';
import { User } from 'src/user/schemas/user.schema';
import { PostRepository } from './repository/post.repository.interface';
import { PostTypeormRepository } from './repository/typeorem/post.typeorm.repository';
import { Post } from './schemas/post.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostController],
  providers: [
    PostService,
    {
      provide: PostRepository,
      useClass: PostTypeormRepository,
    },
    {
      provide: UserRepository,
      useClass: UserTypeormRepository,
    },
  ],
})
export class PostModule {}
