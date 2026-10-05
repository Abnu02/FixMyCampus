import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/route';
import { technicianRoutes } from './features/Technician/routes';

export const routes: Routes = [...authRoutes, ...technicianRoutes
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/Admin/admin.module').then((module) => module.AdminModule)
  }
];
