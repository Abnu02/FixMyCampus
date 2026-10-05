import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResolvedTicket, Ticket, TicketStatus } from '../models/ticket.model';

/**
 * This store is kept as a fallback reference but is NO LONGER USED.
 * AdminTicketService now calls the real backend API.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminStoreService {
  private tickets: Ticket[] = [
    {
      id: 1,
      category: 'Electrical',
      buildingName: 'Block A',
      room: '204',
      description: 'Power outlet is short-circuiting.',
      technicianID: null,
      status: TicketStatus.New,
      createdAt: '2026-10-05T10:30:00Z'
    },
    {
      id: 2,
      category: 'Plumbing',
      buildingName: 'Block A',
      room: '102',
      description: 'Main water line leaking.',
      technicianID: null,
      status: TicketStatus.New,
      createdAt: '2026-10-05T09:15:00Z'
    },
    {
      id: 3,
      category: 'IT Infrastructure',
      buildingName: 'Block B',
      room: 'Lab 3',
      description: 'Ceiling network router lost power.',
      technicianID: 3,
      status: TicketStatus.Assigned,
      createdAt: '2026-10-05T08:00:00Z'
    }
  ];

  getTickets(): Observable<Ticket[]> {
    return of([...this.tickets]);
  }

  getTicketById(id: number): Observable<Ticket | undefined> {
    const ticket = this.tickets.find(t => t.id === id);
    return of(ticket ? { ...ticket } : undefined);
  }

  getResolvedTickets(): Observable<ResolvedTicket[]> {
    const resolved = this.tickets
      .filter(t => t.status === TicketStatus.Resolved)
      .map(t => ({ ...t, resolvedAt: null }));
    return of(resolved);
  }
}