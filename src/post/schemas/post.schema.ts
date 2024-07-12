import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/schemas/user.schema';
import { IPost } from './models/post.interface';

@Entity({ name: 'posts' })
export class Post implements IPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ name: 'created_at' })
  createAt: Date;

  @Column({ name: 'updated_at' })
  updateAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
