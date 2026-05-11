import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Inventory',
  timestamps: true
})
export class Inventory extends Model {
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
  itemName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  category!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  })
  quantity!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  unit!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  supplierName?: string;
}
