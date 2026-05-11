import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { User } from '../models/User';
import { Staff } from '../models/staff';

@Table({ timestamps: true })
export class StaffDuty extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  staffId!: string;

  @BelongsTo(() => Staff)
  staff!: Staff;

  @Column({
    type: DataType.ENUM(
      'Pooja Ritual',
      'Annadanam Service',
      'Temple Operations',
      'Administration',
      'Volunteer Coordination',
      'Maintenance'
    ),
    allowNull: false
  })
  dutyType!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  dutyDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  timeSlot!: string;

  @Column(DataType.STRING)
  location?: string;

  @Column({
    type: DataType.ENUM('Scheduled', 'Completed', 'Cancelled'),
    defaultValue: 'Scheduled'
  })
  dutyStatus!: string;

  @Column(DataType.TEXT)
  notes?: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  createdBy?: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  updatedBy?: number;

  @BelongsTo(() => User, 'createdBy')
  createdUser!: User;

  @BelongsTo(() => User, 'updatedBy')
  updatedUser!: User;
}
