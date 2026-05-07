import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey
} from 'sequelize-typescript';
import { User } from './User';
import { Permission } from './Permission';

@Table({
  tableName: 'user_permissions',
  timestamps: true
})
export class UserPermission extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  permissionId!: number;
}
