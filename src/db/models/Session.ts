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
  tableName: 'Sessions'
})
export class Session extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  tokenHash!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiry!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  userAgent?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  ipAddress?: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user!: User;
}
