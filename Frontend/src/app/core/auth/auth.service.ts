import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse
} from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Backend API URL matching Backend/FixMyCampus.Api launchSettings.json (port 5168)
  private readonly apiUrl = 'http://localhost:5168/api/v1/auth';

  // Signals for reactive session management
  readonly currentUser = signal<AuthResponse | null>(this.getStoredUser());
  readonly isAuthenticated = signal<boolean>(!!localStorage.getItem('fixmycampus_token'));

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('fixmycampus_token', response.token);
    localStorage.setItem('fixmycampus_user', JSON.stringify(response));

    this.currentUser.set(response);
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

  private getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem('fixmycampus_user');
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthResponse;
    } catch {
      return null;
    }
  }
}