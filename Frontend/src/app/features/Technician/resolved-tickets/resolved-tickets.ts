import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TechnicianNavbar } from '../technician-navbar/technician-navbar';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-resolved-tickets',
  standalone: true,
  imports: [TechnicianNavbar, RouterLink],
  templateUrl: './resolved-tickets.html',
  styleUrl: './resolved-tickets.scss'
})
export class ResolvedTickets {
  private ticketService = inject(TicketService);

  tickets = this.ticketService.tickets.filter(
    ticket => ticket.status === 'Resolved'
  );
}