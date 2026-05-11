import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';

import { Devotee } from '../models/devotees';

@Table({ timestamps: true })
export class FamilyMember extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  declare id: string;

  @ForeignKey(() => Devotee)
  @Column(DataType.UUID)
  devoteeId!: string;

  @Column(DataType.STRING)
  memberName!: string;

  @Column(
    DataType.ENUM(
      'Spouse',
      'Son',
      'Daughter',
      'Father',
      'Mother',
      'Brother',
      'Sister',
      'Other'
    )
  )
  relation!: string;

  @Column(DataType.DATE)
  dateOfBirth?: Date;

  @Column(DataType.ENUM('Male', 'Female', 'Other'))
  gender?: string;

  @Column(DataType.STRING)
  occupation?: string;

  @Column(DataType.STRING)
  phone?: string;

  @Column(DataType.STRING)
  rasi?: string;

  @Column(DataType.STRING)
  nakshatra?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  parentNode!: boolean;

  @BelongsTo(() => Devotee, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  devotee!: Devotee;
}
