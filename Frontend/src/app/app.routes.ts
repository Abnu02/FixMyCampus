import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/route';
import { technicianRoutes } from './features/Technician/routes';

export const routes: Routes = [...authRoutes, ...technicianRoutes];
