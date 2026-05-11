import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { User } from '../models/User';

@Table({ timestamps: true })
export class TempleEvent extends Model {
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
  eventCode?: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  eventName!: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  festivalName?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date!: Date;

  @Column({ type: DataType.STRING(10), allowNull: false })
  time!: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  organizerName?: string;

  @Column({
    type: DataType.ENUM('Planned', 'Scheduled', 'In Progress', 'Completed'),
    allowNull: false,
    defaultValue: 'Planned'
  })
  status!: 'Planned' | 'Scheduled' | 'In Progress' | 'Completed';

  @Column({ type: DataType.INTEGER, allowNull: true })
  expectedDevotees?: number;

  @Column({ type: DataType.STRING(100), allowNull: true })
  poojaType?: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  prasadamPlanned?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  resourceNeeded?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isRecurring!: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  createdBy?: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  updatedBy?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  isDeleted!: boolean;

  @BelongsTo(() => User, 'createdBy')
  creator?: User;

  @BelongsTo(() => User, 'updatedBy')
  updater?: User;
}
