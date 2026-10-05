import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardOverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }