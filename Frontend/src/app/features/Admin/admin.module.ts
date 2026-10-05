import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketHistoryComponent } from './components/ticket-history/ticket-history.component';
import { CampusManagementComponent } from './components/campus-management/campus-management.component';
import { TechnicianManagementComponent } from './components/technician-management/technician-management.component';
import { authInterceptor } from '../../core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardOverviewComponent,
    TicketListComponent,
    TicketHistoryComponent,
    CampusManagementComponent,
    TechnicianManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
})
export class AdminModule { }