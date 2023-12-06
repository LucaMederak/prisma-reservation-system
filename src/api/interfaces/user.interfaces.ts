export interface IUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserJWT {
  id: number;
  name: string;
  lastName: string;
  email: string;
  sessionId: number;
}

export interface IUserDocument extends IUserInput {
  emailVerified: boolean;
}
