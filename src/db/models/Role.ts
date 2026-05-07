import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript';
import { User } from './User';
import { RolePermission } from './RolePermission';
import { Permission } from './Permission';

@Table
export class Role extends Model {
  @Column({
    type: DataType.ENUM('superadmin', 'admin', 'company_superadmin'),
    allowNull: false,
    unique: true
  })
  name!: 'superadmin' | 'admin' | 'company_superadmin';

  @Column({ type: DataType.STRING, allowNull: true })
  description?: string;

  @HasMany(() => User)
  users!: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions!: Permission[];

  @HasMany(() => RolePermission)
  rolePermissions!: RolePermission[];

  @Column({ type: DataType.INTEGER, allowNull: true })
  createdBy?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updatedBy?: number;
}
