export type UserRole = 'Reporter' | 'Admin';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  userId: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse extends UserResponse {
  token?: string;
}

export interface MessageResponse {
  message: string;
}