import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { ParkingZone } from './parking-zones';

@Table({ timestamps: true, tableName: 'parking_entries' })
export class ParkingEntry extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @ForeignKey(() => ParkingZone)
  @Column({ type: DataType.UUID, allowNull: false })
  parking_zone_id!: string;

  @BelongsTo(() => ParkingZone)
  zone!: ParkingZone;

  @Column({ type: DataType.STRING, allowNull: false })
  licensePlate!: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  duration!: Date;
}
