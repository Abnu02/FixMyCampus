import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reporter',
    loadComponent: () =>
      import('./features/reporter/campus-feed/campus-feed')
        .then(m => m.CampusFeedComponent)
  },
  {
    path: 'reporter/create',
    loadComponent: () =>
      import('./features/reporter/create-ticket/create-ticket')
        .then(m => m.CreateTicketComponent)
  },
  {
    path: 'reporter/tickets/:id',
    loadComponent: () =>
      import('./features/reporter/ticket-detail/ticket-detail')
        .then(m => m.TicketDetailComponent)
  },
  {
    path: 'reporter/tickets',
    loadComponent: () =>
      import('./features/reporter/my-tickets/my-tickets')
        .then(m => m.MyTicketsComponent)
  },
  {
    path: '',
    redirectTo: 'reporter',
    pathMatch: 'full'
  }
];