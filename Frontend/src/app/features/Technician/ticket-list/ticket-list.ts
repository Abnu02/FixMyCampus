import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.scss'
})
export class TicketList {
  private ticketService = inject(TicketService);

  tickets = this.ticketService.tickets;

  acceptTicket(ticketId: number) {
    this.ticketService.acceptTicket(ticketId);
  }

  resolveTicket(ticketId: number) {
    this.ticketService.resolveTicket(ticketId);
  }
}