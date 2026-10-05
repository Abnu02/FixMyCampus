import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  tickets = [
    {
      id: 1,
      category: 'Electrical',
      buildingId: 1,
      room: '204',
      description: 'Projector is not working.',
      status: 'Assigned',
      createdAt: '2026-10-05',
    },
    {
      id: 2,
      category: 'Plumbing',
      buildingId: 2,
      room: '102',
      description: 'Water leakage in the bathroom.',
      status: 'In Progress',
      createdAt: '2026-10-05',
    },
  ];
  acceptTicket(ticketId: number) {
    const ticket = this.tickets.find((t) => t.id === ticketId);

    if (ticket && ticket.status === 'Assigned') {
      ticket.status = 'In Progress';
    }
  }

  resolveTicket(ticketId: number) {
    const ticket = this.tickets.find((t) => t.id === ticketId);

    if (ticket && ticket.status === 'In Progress') {
      ticket.status = 'Resolved';
    }
  }

  getTicket(ticketId: number) {
    return this.tickets.find((t) => t.id === ticketId);
  }
}
