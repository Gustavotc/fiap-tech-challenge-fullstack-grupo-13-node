import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IRole, IRoleTypes } from './models/role.interface';

@Entity({ name: 'roles' })
export class Role implements IRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: IRoleTypes;
}
