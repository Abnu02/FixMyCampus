import { Component, OnInit } from '@angular/core';
import { Ticket, TicketStatus } from '../../models/ticket.model';
import { AdminTicketService } from '../../services/admin-ticket.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: false,
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit {
  stats = {
    totalActive: 0,
    needsTechnician: 0,
    underRepair: 0,
    resolved: 0
  };
  isLoading = false;
  errorMessage = '';

  constructor(private adminTicketService: AdminTicketService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminTicketService.getTickets().subscribe({
      next: tickets => {
        this.updateStats(tickets);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Dashboard ticket statistics could not be loaded. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private updateStats(tickets: Ticket[]): void {
    const resolved = tickets.filter(ticket => ticket.status === TicketStatus.Resolved);

    this.stats = {
      totalActive: tickets.length - resolved.length,
      needsTechnician: tickets.filter(ticket => ticket.status === TicketStatus.New).length,
      underRepair: tickets.filter(ticket =>
        ticket.status === TicketStatus.Assigned || ticket.status === TicketStatus.InProgress
      ).length,
      resolved: resolved.length
    };
  }
}