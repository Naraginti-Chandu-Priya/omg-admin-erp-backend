import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany
} from 'sequelize-typescript';
import { User } from './User';
import { UserPermission } from './UserPermission';

@Table({
  tableName: 'permissions',
  timestamps: true
})
export class Permission extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  route!: string;

  @Column({
    type: DataType.ENUM('read', 'read_write'),
    allowNull: false
  })
  access!: 'read' | 'read_write';

  @BelongsToMany(() => User, () => UserPermission)
  users!: User[];
}
