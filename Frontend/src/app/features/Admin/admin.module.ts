import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketHistoryComponent } from './components/ticket-history/ticket-history.component';
import { CampusManagementComponent } from './components/campus-management/campus-management.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardOverviewComponent,
    TicketListComponent,
    TicketHistoryComponent,
    CampusManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }