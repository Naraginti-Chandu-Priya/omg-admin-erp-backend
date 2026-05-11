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
export class CommunicationPreference extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  declare id: string;

  @ForeignKey(() => Devotee)
  @Column({ type: DataType.UUID, unique: true })
  devoteeId!: string;

  @Column({ defaultValue: true })
  smsEnabled!: boolean;

  @Column({ defaultValue: true })
  emailEnabled!: boolean;

  @Column({ defaultValue: true })
  whatsappEnabled!: boolean;

  @Column(DataType.ENUM('Tamil', 'English', 'Hindi'))
  preferredLanguage?: string;

  @Column({ defaultValue: false })
  unsubscribedAll!: boolean;

  @BelongsTo(() => Devotee, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  devotee!: Devotee;
}
