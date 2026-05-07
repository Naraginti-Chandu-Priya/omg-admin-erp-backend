export interface CreateSecret {
  userId: number;
  exp: Date;
  passwordHash: string;
}
