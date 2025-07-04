export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
