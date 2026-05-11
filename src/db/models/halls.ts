import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { User } from './User';

@Table({ timestamps: true })
export class Hall extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  hallCode!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  capacity!: number;

  @Column({
    type: DataType.ENUM('hourly', 'daily', 'tiered'),
    allowNull: false
  })
  pricingStrategy!: string;

  @Column(DataType.DECIMAL(10, 2))
  ratePerHour?: number;

  @Column(DataType.DECIMAL(10, 2))
  ratePerDay?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  depositAmount?: number;

  @Column({
    type: DataType.TEXT,
    defaultValue: '[]'
  })
  amenities!: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: '[]'
  })
  images!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isAvailable!: boolean;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  createdBy?: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  updatedBy?: number;

  @BelongsTo(() => User, {
    as: 'createdByUser',
    foreignKey: 'createdBy',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  createdUser!: User;

  @BelongsTo(() => User, {
    as: 'updatedByUser',
    foreignKey: 'updatedBy',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  updatedUser!: User;
}
