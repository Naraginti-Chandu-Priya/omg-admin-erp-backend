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
export class Staff extends Model {
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

  @Column({
    type: DataType.ENUM('Priest', 'Support Staff'),
    allowNull: false
  })
  staffRole!: string;

  @Column(DataType.STRING)
  department?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  joiningDate!: Date;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0
  })
  salary!: number;

  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    defaultValue: 'Active'
  })
  status!: string;

  @Column(DataType.STRING)
  phoneNumber?: string;

  @Column(DataType.STRING)
  email?: string;

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
