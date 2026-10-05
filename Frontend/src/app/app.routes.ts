import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/route';
import { technicianRoutes } from './features/Technician/routes';
import { reporterRoutes } from './features/reporter/route';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  ...authRoutes,
  ...technicianRoutes,
  ...reporterRoutes,
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['Admin'])],
    loadChildren: () =>
      import('./features/Admin/admin.module').then((module) => module.AdminModule)
  }
];
