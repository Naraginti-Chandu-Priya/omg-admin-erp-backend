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
export class Asset extends Model {
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
  assetCode!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column(DataType.STRING)
  category?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  purchaseDate!: Date;

  @Column({
    type: DataType.ENUM('Excellent', 'Good', 'Fair', 'Poor'),
    defaultValue: 'Good'
  })
  condition!: string;

  @Column({
    type: DataType.ENUM('Up to Date', 'Due Soon', 'Overdue'),
    defaultValue: 'Up to Date'
  })
  maintenanceStatus!: string;

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
