export interface Technician {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  category: string;
  isActive: boolean;
  createdAt?: string;
}