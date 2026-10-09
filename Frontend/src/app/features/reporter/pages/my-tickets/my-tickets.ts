import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ReporterApiService } from '../../services/reporter-api.service';
import { TicketListItem } from '../../models/ticket.model';
import { ReporterNavComponent } from '../../components/reporter-nav/reporter-nav';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink, ReporterNavComponent],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTicketsComponent implements OnInit {
  private readonly api = inject(ReporterApiService);

  tickets: TicketListItem[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getMyTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load your tickets.';
        this.loading = false;
      }
    });
  }

  displayStatus(status: string): string {
    // Reporter UI displays Assigned as In Progress.
    if (status === 'Assigned') {
      return 'In Progress';
    }

    return status;
  }
}