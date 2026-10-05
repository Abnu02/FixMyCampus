import { Component, inject } from '@angular/core';
import { TechnicianNavbar } from '../technician-navbar/technician-navbar';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-technician-profile',
  standalone: true,
  imports: [TechnicianNavbar],
  templateUrl: './technician-profile.html',
  styleUrl: './technician-profile.scss',
})
export class TechnicianProfile {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
