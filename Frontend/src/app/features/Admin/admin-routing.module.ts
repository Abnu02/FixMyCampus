import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverviewComponent },
      // Sub-routes for future steps:
      // { path: 'tickets', component: TicketListComponent },
      // { path: 'ticket-history', component: TicketHistoryComponent },
      // { path: 'campus', component: CampusManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }