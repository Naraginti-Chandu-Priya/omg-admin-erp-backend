import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum DistributionStatus {
  PENDING = 'Pending',
  SERVED = 'Served',
  PARTIAL = 'Partial',
  CANCELLED = 'Cancelled'
}

@Table({
  tableName: 'Distribution',
  timestamps: true
})
export class Distribution extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  mealPlanId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  actualServedCount!: number;

  @Column({
    type: DataType.ENUM(
      DistributionStatus.PENDING,
      DistributionStatus.SERVED,
      DistributionStatus.PARTIAL,
      DistributionStatus.CANCELLED
    ),
    allowNull: false
  })
  serviceStatus!: DistributionStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  startTime!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  endTime?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  leadVolunteer?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  leftoverRecord?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  feedback?: string;
}
