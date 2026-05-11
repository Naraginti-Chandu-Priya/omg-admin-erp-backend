import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany
} from 'sequelize-typescript';

import { Role } from './Role';
import { Temple } from './Temple';
import { Permission } from './Permission';
import { UserPermission } from './UserPermission';

@Table
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  dateOfBirth?: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  phoneNumber?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  qualification?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  profilePic?: string;

  @Column({
    type: DataType.ENUM('active', 'suspended', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  })
  accountStatus!: 'active' | 'suspended' | 'inactive';

  @Column({ type: DataType.DATE, allowNull: true })
  lastLogin?: Date;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId!: number; // Foreign key for Role

  @Column({ type: DataType.INTEGER, allowNull: true })
  createdBy?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updatedBy?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isFirstLogin!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  mfaCode?: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  mfaFailedCount!: number;

  @Column({ type: DataType.DATE, allowNull: true })
  mfaAccountLockedUntil?: Date;

  @ForeignKey(() => Temple)
  @Column({ type: DataType.UUID, allowNull: true })
  templeId?: string;

  @BelongsTo(() => Role)
  role!: Role;

  @BelongsTo(() => Temple)
  temple?: Temple;

  @BelongsToMany(() => Permission, () => UserPermission)
  userPermissions!: Permission[];
}
