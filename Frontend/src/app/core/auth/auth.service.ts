import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
  MessageResponse
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Default API endpoint - adjust port to match backend
  private readonly apiUrl = 'http://localhost:5151/api/v1/auth';

  // Signals for reactive session management
  readonly currentUser = signal<UserResponse | null>(this.getStoredUser());
  readonly isAuthenticated = signal<boolean>(!!localStorage.getItem('fixmycampus_token'));

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest) {
    return this.http.post<MessageResponse>(`${this.apiUrl}/register`, request);
  }

  saveSession(response: LoginResponse): void {
    const token = response.token ?? response.userId;
    localStorage.setItem('fixmycampus_token', token);

    const user: UserResponse = {
      userId: response.userId,
      email: response.email,
      role: response.role
    };

    localStorage.setItem('fixmycampus_user', JSON.stringify(user));

    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    this.clearSession();
  }

  clearSession(): void {
    localStorage.removeItem('fixmycampus_token');
    localStorage.removeItem('fixmycampus_user');

    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('fixmycampus_token');
  }

  private getStoredUser(): UserResponse | null {
    const user = localStorage.getItem('fixmycampus_user');
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as UserResponse;
    } catch {
      return null;
    }
  }
}