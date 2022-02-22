export interface User {
  _id: string;
  name: string;
  age: number;
  company: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'editor' | 'viewer';
