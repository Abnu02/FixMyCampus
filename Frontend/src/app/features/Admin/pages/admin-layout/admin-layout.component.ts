import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
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

  adminUser = {
    name: 'Admin User',
    email: 'admin@campus.edu'
  };

  constructor(private router: Router) {}

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
    // Clear tokens & route to login
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }}