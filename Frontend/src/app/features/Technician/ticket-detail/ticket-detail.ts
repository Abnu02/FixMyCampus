import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.scss'
})
export class TicketDetail {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  ticketId = Number(this.route.snapshot.paramMap.get('id'));

  ticket = this.ticketService.getTicket(this.ticketId);

  acceptTicket() {
    this.ticketService.acceptTicket(this.ticketId);
  }

  markAsResolved() {
    this.ticketService.resolveTicket(this.ticketId);
  }
}