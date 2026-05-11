import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { User } from '../models/User';
import { Devotee } from './devotees';

@Table({ timestamps: true })
export class PoojaSeva extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: true
  })
  sevaCode?: string;

  @ForeignKey(() => Devotee)
  @Column({ type: DataType.UUID, allowNull: true })
  devoteeId?: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  sevaName!: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  sevaAmount!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  sevaDate!: Date;

  @Column({ type: DataType.STRING(100), allowNull: true })
  firstName?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  lastName?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  phone?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  gothram?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  nakshatra?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  rasi?: string;

  @Column({
    type: DataType.ENUM('Scheduled', 'Completed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Scheduled'
  })
  status!: 'Scheduled' | 'Completed' | 'Cancelled';

  @Column({
    type: DataType.ENUM('Pending', 'Paid', 'Refunded'),
    allowNull: false,
    defaultValue: 'Pending'
  })
  paymentStatus!: 'Pending' | 'Paid' | 'Refunded';

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true
  })
  receiptNumber?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  registeredBy?: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  updatedBy?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isDeleted!: boolean;

  @BelongsTo(() => Devotee)
  devotee?: Devotee;

  @BelongsTo(() => User, 'registeredBy')
  registeredByUser?: User;

  @BelongsTo(() => User, 'updatedBy')
  updatedByUser?: User;
}
