import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  isSidebarCollapsed = false;
  isMobileOpen = false;
  isProfileMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get adminUser() {
    const user = this.authService.currentUser();
    return {
      name: user?.displayName || 'Hackathon Admin',
      email: user?.email || 'admin@hackathon.local'
    };
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}