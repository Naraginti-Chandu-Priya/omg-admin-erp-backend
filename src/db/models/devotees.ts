import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne
} from 'sequelize-typescript';

import { User } from '../models/User';
import { FamilyMember } from './family-members';
import { ReminderPreference } from './reminder-preferences';
import { CommunicationPreference } from './communication-preferences';
import { SpiritualProfile } from './spiritual-profiles';
import { Donation } from './donation';
import { PoojaSeva } from './poojaseva';

@Table({ timestamps: true })
export class Devotee extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({ type: DataType.STRING(20), unique: true })
  devoteeCode?: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING(20), allowNull: true, unique: true })
  phone?: string;

  @Column({ type: DataType.STRING(150), allowNull: true, unique: true })
  email?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  addressLine?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  city?: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  state?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    defaultValue: 'India'
  })
  country?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  dateOfBirth?: Date;

  @Column({
    type: DataType.ENUM('Male', 'Female', 'Other'),
    allowNull: true
  })
  gender?: 'Male' | 'Female' | 'Other';

  @Column({ type: DataType.STRING(100), allowNull: true })
  occupation?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  devoteeProfilePicture?: string;

  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active'
  })
  status!: 'Active' | 'Inactive';

  @Column({
    type: DataType.ENUM('Regular', 'Silver', 'Gold', 'Platinum', 'VIP'),
    allowNull: true
  })
  membershipType?: 'Regular' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  createdBy?: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  updatedBy?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isDeleted!: boolean;

  @BelongsTo(() => User, {
    foreignKey: 'createdBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  createdByUser?: User;

  @BelongsTo(() => User, {
    foreignKey: 'updatedBy',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  updatedByUser?: User;

  @HasOne(() => SpiritualProfile, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  spiritualProfile!: SpiritualProfile;

  @HasOne(() => CommunicationPreference, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  communicationPreference!: CommunicationPreference;

  @HasOne(() => ReminderPreference, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  reminderPreference!: ReminderPreference;

  @HasMany(() => FamilyMember, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  familyMembers!: FamilyMember[];

  @HasMany(() => Donation)
  donations!: Donation[];

  @HasMany(() => PoojaSeva)
  poojaSevas!: PoojaSeva[];
}
