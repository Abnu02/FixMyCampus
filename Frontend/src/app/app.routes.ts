import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent)
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () =>
      // Points to LoginComponent as a temporary placeholder until your teammate finishes the Feed component
      import('./features/auth/login/login').then((m) => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['Admin'])],
    loadComponent: () =>
      // Points to LoginComponent as a temporary placeholder until your teammate finishes the Admin component
      import('./features/auth/login/login').then((m) => m.LoginComponent)
  }
];
