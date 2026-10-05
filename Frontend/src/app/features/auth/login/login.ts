import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // 1-Click test accounts matching Backend IdentitySeeder
  fillReporterDemo(): void {
    this.loginForm.patchValue({
      email: 'user@hackathon.local',
      password: 'User123!'
    });
  }
  fillAdminDemo(): void {
    this.loginForm.patchValue({
      email: 'admin@hackathon.local',
      password: 'Admin123!'
    });
  }
  fillTecnicianDemo(): void {
    this.loginForm.patchValue({
      email: 'teschnician@hackathon.local',
      password: 'Technician123!'
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.loading = false;
        this.navigateByRole(response.role);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ??
          'Invalid email or password. Please try again.';
      }
    });
  }

  private navigateByRole(role: string): void {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Technician') {
      this.router.navigate(['/technician']);
    } else {
      this.router.navigate(['/feed']);
    }
  }
}
