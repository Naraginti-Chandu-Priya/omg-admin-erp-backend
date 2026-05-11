import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey
} from 'sequelize-typescript';
import { User } from './User';

const dialect = (process.env.SQL_TYPE ?? 'postgres').toLowerCase();

@Table
export class Audit extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  entityType!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  entityId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  action!: string;

  @Column({
    type: dialect === 'mssql' ? DataType.STRING : DataType.JSON,
    allowNull: true,
    get() {
      const value = this.getDataValue('previousData');
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value;
    }
  })
  declare previousData?: object;

  @Column({
    type: dialect === 'mssql' ? DataType.STRING : DataType.JSON,
    allowNull: true,
    get() {
      const value = this.getDataValue('newData');
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value;
    }
  })
  declare newData?: object;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  performedBy?: number;
}
