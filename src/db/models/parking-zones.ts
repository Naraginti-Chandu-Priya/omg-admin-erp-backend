import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ParkingEntry } from './parking-entries';

@Table({ timestamps: true, tableName: 'parking_zones' })
export class ParkingZone extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  area_name!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  total_capacity!: number;

  @Column({
    type: DataType.ENUM('general', 'staff', 'vip'),
    allowNull: false
  })
  access_category!: 'general' | 'staff' | 'vip';

  @Column({
    type: DataType.ENUM(
      'primary',
      'secondary',
      'destructive',
      'purple',
      'green',
      'yellow'
    ),
    allowNull: false,
    defaultValue: 'primary'
  })
  area_theme!:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'purple'
    | 'green'
    | 'yellow';

  @Column({
    type: DataType.ENUM('available', 'occupied', 'reserved'),
    allowNull: false,
    defaultValue: 'available'
  })
  status!: 'available' | 'occupied' | 'reserved';

  @Column({
    type: DataType.ENUM('100', '50', 'free'),
    allowNull: false
  })
  price_per_hour!: '100' | '50' | 'free';

  @HasMany(() => ParkingEntry)
  entries!: ParkingEntry[];
}
