import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';


@Component({
  selector: 'app-reporter-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './reporter-nav.html',
  styleUrl: './reporter-nav.css'
})
export class ReporterNavComponent {
  private readonly authService = inject(AuthService);

  get currentUser() {
    return this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}