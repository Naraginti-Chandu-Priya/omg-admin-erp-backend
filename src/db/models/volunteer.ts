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
export class Volunteer extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  fullName!: string;

  @Column(DataType.STRING)
  phoneNumber?: string;

  @Column(DataType.STRING)
  email?: string;

  @Column(DataType.STRING)
  preferredArea?: string;

  @Column({
    type: DataType.ENUM(
      'Morning (06:00 - 12:00)',
      'Evening (16:00 - 21:00)',
      'Full Day',
      'Weekends Only'
    ),
    allowNull: false
  })
  availability!: string;

  @Column({
    type: DataType.ENUM('Beginner', 'Intermediate', 'Master / Lead'),
    defaultValue: 'Beginner'
  })
  experienceLevel!: string;

  @Column({
    type: DataType.ENUM(
      'Registered',
      'Active',
      'Assigned (On Duty)',
      'On Leave',
      'Inactive'
    ),
    defaultValue: 'Registered'
  })
  currentStatus!: string;

  @Column(DataType.JSON)
  skills?: string[];

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
