import { Component } from '@angular/core';
import { TechnicianNavbar } from '../technician-navbar/technician-navbar';
import { TicketList } from '../ticket-list/ticket-list';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [TechnicianNavbar, TicketList],
  templateUrl: './technician-dashboard.html',
  styleUrl: './technician-dashboard.scss',
})
export class TechnicianDashboard {}
