import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reporter',
    loadComponent: () =>
      import('./features/reporter/pages/campus-feed/campus-feed')
        .then(m => m.CampusFeedComponent)
  },
  {
    path: 'reporter/create',
    loadComponent: () =>
      import('./features/reporter/pages/create-ticket/create-ticket')
        .then(m => m.CreateTicketComponent)
  },
  {
    path: 'reporter/tickets/:id',
    loadComponent: () =>
      import('./features/reporter/pages/ticket-detail/ticket-detail')
        .then(m => m.TicketDetailComponent)
  },
  {
    path: 'reporter/tickets',
    loadComponent: () =>
      import('./features/reporter/pages/my-tickets/my-tickets')
        .then(m => m.MyTicketsComponent)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/Admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    redirectTo: 'reporter',
    pathMatch: 'full'
  }
];