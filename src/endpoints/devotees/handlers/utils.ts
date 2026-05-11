import { randomUUID } from 'crypto';
import { FamilyMember } from 'db';
import { sequelize } from 'node-server-engine';

export type FamilyMemberRelation =
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Father'
  | 'Mother'
  | 'Brother'
  | 'Sister'
  | 'Other';

export type FamilyMemberGender = 'Male' | 'Female' | 'Other';

export interface NormalizedFamilyMember {
  id: string;
  relation: FamilyMemberRelation;
  memberName: string;
  dateOfBirth?: string;
  gender?: FamilyMemberGender;
  occupation?: string;
  phone?: string;
  rasi?: string;
  nakshatra?: string;
  parentNode: boolean;
}

interface RawFamilyMember {
  id?: unknown;
  relation?: unknown;
  memberName?: unknown;
  dateOfBirth?: unknown;
  gender?: unknown;
  occupation?: unknown;
  phone?: unknown;
  rasi?: unknown;
  nakshatra?: unknown;
  parentNode?: unknown;
}

const FAMILY_GENDERS = new Set<FamilyMemberGender>(['Male', 'Female', 'Other']);

export function parsePositiveInteger(value: unknown, fallback: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

function normalizeRelation(value: unknown): FamilyMemberRelation {
  if (typeof value !== 'string') return 'Other';

  const normalized = value.trim().toLowerCase();
  const relationMap: Record<string, FamilyMemberRelation> = {
    spouse: 'Spouse',
    son: 'Son',
    daughter: 'Daughter',
    father: 'Father',
    mother: 'Mother',
    brother: 'Brother',
    sister: 'Sister',
    other: 'Other'
  };

  return relationMap[normalized] ?? 'Other';
}

function normalizeGender(value: unknown): FamilyMemberGender | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  if (!FAMILY_GENDERS.has(normalized as FamilyMemberGender)) {
    return undefined;
  }
  return normalized as FamilyMemberGender;
}

function normalizeFamilyMembers(raw: unknown): NormalizedFamilyMember[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const parsedMembers = raw
    .filter(
      (entry): entry is RawFamilyMember =>
        Boolean(entry) && typeof entry === 'object'
    )
    .map((entry) => {
      const memberName =
        typeof entry.memberName === 'string' ? entry.memberName.trim() : '';
      const relation = normalizeRelation(entry.relation);
      const providedId = typeof entry.id === 'string' ? entry.id : undefined;
      const dateOfBirth =
        typeof entry.dateOfBirth === 'string'
          ? entry.dateOfBirth.trim()
          : undefined;
      const gender = normalizeGender(entry.gender);
      const occupation =
        typeof entry.occupation === 'string'
          ? entry.occupation.trim()
          : undefined;
      const phone =
        typeof entry.phone === 'string' ? entry.phone.trim() : undefined;
      const rasi =
        typeof entry.rasi === 'string' ? entry.rasi.trim() : undefined;
      const nakshatra =
        typeof entry.nakshatra === 'string'
          ? entry.nakshatra.trim()
          : undefined;
      const parentNode = entry.parentNode === true;

      return {
        providedId,
        relation,
        memberName,
        dateOfBirth: dateOfBirth || undefined,
        gender,
        occupation,
        phone,
        rasi,
        nakshatra,
        parentNode
      };
    })
    .filter((entry) => entry.memberName.length > 0);

  return parsedMembers.map((entry) => ({
    id: entry.providedId || randomUUID(),
    relation: entry.relation,
    memberName: entry.memberName,
    dateOfBirth: entry.dateOfBirth,
    gender: entry.gender,
    occupation: entry.occupation,
    phone: entry.phone,
    rasi: entry.rasi,
    nakshatra: entry.nakshatra,
    parentNode: entry.parentNode
  }));
}

export async function persistFamilyMembers(
  devoteeId: string,
  rawFamilyMembers: unknown,
  transaction: Awaited<ReturnType<typeof sequelize.transaction>>
): Promise<void> {
  if (!Array.isArray(rawFamilyMembers)) {
    return;
  }

  await FamilyMember.destroy({ where: { devoteeId }, transaction });

  const normalizedMembers = normalizeFamilyMembers(rawFamilyMembers);

  if (normalizedMembers.length === 0) {
    return;
  }

  await FamilyMember.bulkCreate(
    normalizedMembers.map((member) => ({
      id: member.id,
      devoteeId,
      relation: member.relation,
      memberName: member.memberName,
      dateOfBirth: member.dateOfBirth,
      gender: member.gender,
      occupation: member.occupation,
      phone: member.phone,
      rasi: member.rasi,
      nakshatra: member.nakshatra,
      parentNode: member.parentNode
    })),
    { transaction }
  );
}
