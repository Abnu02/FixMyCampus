import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-technician-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './technician-navbar.html',
  styleUrl: './technician-navbar.scss',
})
export class TechnicianNavbar {
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
