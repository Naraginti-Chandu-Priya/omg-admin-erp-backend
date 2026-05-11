import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum ProcurementStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

@Table({
  tableName: 'Procurement',
  timestamps: true
})
export class Procurement extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  poNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  vendor!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  date!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ProcurementStatus.PENDING
  })
  status!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  items!: object[];

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  deliveryDate?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  paymentTerms?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  rejectionReason?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  submittedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  submittedByName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  approvedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  approvedByName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  approvedDate?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  rejectedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  rejectedByName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  rejectedDate?: string;
}
