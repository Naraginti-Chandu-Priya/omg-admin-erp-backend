import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'Temples',
  timestamps: true
})
export class Temple extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  city?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  state?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  country?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  logo?: string;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  })
  status!: 'active' | 'inactive';

  @Column({ type: DataType.INTEGER, allowNull: true })
  createdBy?: number;

  @HasMany(() => User, { onDelete: 'CASCADE',onUpdate: 'CASCADE' })
  users!: User[];
}
