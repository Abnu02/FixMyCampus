import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () => import('./auth-success/auth-success').then((m) => m.AuthSuccess),
  },

];
