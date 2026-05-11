import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { Devotee } from '../models/devotees';
import { User } from '../models/User';

@Table({ timestamps: true })
export class Donation extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @ForeignKey(() => Devotee)
  @Column({ type: DataType.UUID, allowNull: false })
  devoteeId!: string;

  @Column({
    type: DataType.STRING(20),
    unique: true,
    allowNull: false
  })
  donationCode!: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.ENUM(
      'General',
      'Annadanam',
      'Renovation',
      'Festival',
      'Education',
      'Medical'
    )
  })
  category?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  donationDate!: Date;

  @Column({
    type: DataType.ENUM('Hundi', 'Online', 'Counter')
  })
  channel?: string;

  @Column({
    type: DataType.ENUM('Cash', 'UPI', 'Card')
  })
  paymentMethod?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  transactionRef!: string;

  @Column({
    type: DataType.ENUM('Success', 'Pending', 'Failed')
  })
  paymentStatus?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  receiptNumber!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  createdBy?: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  updatedBy?: number;

  @BelongsTo(() => Devotee, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  devotee!: Devotee;

  @BelongsTo(() => User, {
    foreignKey: 'createdBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  createdUser!: User;

  @BelongsTo(() => User, {
    foreignKey: 'updatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  updatedUser!: User;
}
