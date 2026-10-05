import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketHistoryComponent } from './components/ticket-history/ticket-history.component';
import { CampusManagementComponent } from './components/campus-management/campus-management.component';
import { TechnicianManagementComponent } from './components/technician-management/technician-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverviewComponent },
      { path: 'tickets', component: TicketListComponent },
      { path: 'ticket-history', component: TicketHistoryComponent },
      { path: 'campus', component: CampusManagementComponent },
      { path: 'technicians', component: TechnicianManagementComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }