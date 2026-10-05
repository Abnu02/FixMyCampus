import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guard';

export const technicianRoutes: Routes = [
  {
    path: 'technician',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./technician-dashboard/technician-dashboard').then((m) => m.TechnicianDashboard),
  },
  {
    path: 'technician',
    loadComponent: () =>
      import('./technician-dashboard/technician-dashboard').then((m) => m.TechnicianDashboard),
  },
  {
    path: 'technician/tickets/:id',
    loadComponent: () => import('./ticket-detail/ticket-detail').then((m) => m.TicketDetail),
  },
  {
    path: 'technician/resolved',
    loadComponent: () =>
      import('./resolved-tickets/resolved-tickets').then((m) => m.ResolvedTickets),
  },
  {
    path: 'technician/profile',
    loadComponent: () =>
      import('./technician-profile/technician-profile').then((m) => m.TechnicianProfile),
  },
];
