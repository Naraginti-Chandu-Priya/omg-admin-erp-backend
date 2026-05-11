import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { Hall } from './halls';
import { Devotee } from './devotees';
import { User } from './User';

@Table({ timestamps: true })
export class HallBooking extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  bookingCode!: string;

  @ForeignKey(() => Hall)
  @Column({ type: DataType.UUID, allowNull: false })
  hallId!: string;

  @ForeignKey(() => Devotee)
  @Column({ type: DataType.UUID, allowNull: true })
  devoteeId?: string;

  @Column(DataType.STRING)
  bookerName?: string;

  @Column(DataType.STRING)
  bookerPhone?: string;

  @Column(DataType.STRING)
  bookerEmail?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  eventDate!: Date;

  @Column({
    type: DataType.ENUM(
      'full_day',
      'half_day_morning',
      'half_day_evening',
      'custom'
    ),
    allowNull: false
  })
  slot!: string;

  @Column(DataType.STRING)
  eventCategory?: string;

  @Column(DataType.INTEGER)
  guestCount?: number;

  @Column(DataType.TEXT)
  specialRequirements?: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: '[]'
  })
  addons!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  addonsAmount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  baseAmount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  festivalCharge!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  totalAmount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  advanceAmount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0
  })
  amountPaid!: number;

  @Column(DataType.DECIMAL(10, 2))
  balanceDue?: number;

  @Column({
    type: DataType.ENUM('pending', 'partial', 'paid'),
    defaultValue: 'pending'
  })
  paymentStatus!: string;

  @Column({
    type: DataType.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending'
  })
  status!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.TEXT)
  cancellationReason?: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  bookedBy?: number;

  @BelongsTo(() => Hall, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  hall!: Hall;

  @BelongsTo(() => Devotee, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  devotee!: Devotee;

  @BelongsTo(() => User, {
    as: 'bookedByUser',
    foreignKey: 'bookedBy',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  user!: User;
}
