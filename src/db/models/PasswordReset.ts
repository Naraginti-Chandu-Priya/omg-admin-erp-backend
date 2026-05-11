import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { User } from './User';

@Table({
  timestamps: true,
  tableName: 'password-resets'
})
export class PasswordReset extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  otp!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiresAt!: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  attempts!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 5
  })
  maxAttempts!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isUsed!: boolean;

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user!: User;
}
