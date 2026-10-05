import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ReporterApiService } from '../services/reporter-api.service';
import { TicketDetails } from '../models/ticket.model';
import { ReporterNavComponent } from '../reporter-nav/reporter-nav';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ReporterNavComponent],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetailComponent implements OnInit {
  private readonly api = inject(ReporterApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ticket: TicketDetails | null = null;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid ticket.';
      return;
    }

    this.loadTicket(id);
  }

  loadTicket(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getTicket(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the ticket.';
        this.loading = false;
      }
    });
  }

  displayStatus(status: string): string {
    if (status === 'Assigned') {
      return 'In Progress';
    }

    return status;
  }

  goBack(): void {
    this.router.navigate(['/reporter/tickets']);
  }
}