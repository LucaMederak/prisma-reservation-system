export interface ISessionDocument {
  user: string;
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}
