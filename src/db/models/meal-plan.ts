import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum CurrentStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

interface FoodItemsInterface {
  name: string;
  quantity: number;
}

@Table({
  tableName: 'MealPlan',
  timestamps: true
})
export class MealPlan extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  serviceDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  serviceType!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  expectedCrowdCount!: number;

  @Column({
    type: DataType.ENUM(
      CurrentStatus.PLANNED,
      CurrentStatus.IN_PROGRESS,
      CurrentStatus.COMPLETED,
      CurrentStatus.CANCELLED
    ),
    allowNull: false
  })
  currentStatus!: CurrentStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  organizer!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  foodItems!: FoodItemsInterface[];

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  operationalNotes?: string;
}
