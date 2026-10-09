import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const reporterRoutes: Routes = [
    {
        path: 'reporter',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/campus-feed/campus-feed')
                .then(m => m.CampusFeedComponent)
    },
    {
        path: 'reporter/create',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/create-ticket/create-ticket')
                .then(m => m.CreateTicketComponent)
    },
    {
        path: 'reporter/tickets/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/ticket-detail/ticket-detail')
                .then(m => m.TicketDetailComponent)
    },
    {
        path: 'reporter/tickets',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/my-tickets/my-tickets')
                .then(m => m.MyTicketsComponent)
    }
];