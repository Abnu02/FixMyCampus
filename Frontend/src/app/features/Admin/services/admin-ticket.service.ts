import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminTicketResponse, ResolvedTicket, Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class AdminTicketService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin/tickets`;

  constructor(private http: HttpClient) {}

  /**
   * Fetch all tickets with optional filters
   * Endpoint: GET /api/v1/admin/tickets?buildingId=&status=
   */
  getTickets(buildingId?: number, status?: string): Observable<Ticket[]> {
    let params = new HttpParams();
    if (buildingId) params = params.set('buildingId', buildingId.toString());
    if (status) params = params.set('status', status);
    return this.http.get<Ticket[]>(this.baseUrl, { params });
  }

  /**
   * Fetch resolved tickets (filter client-side from all tickets)
   */
  getResolvedTickets(): Observable<ResolvedTicket[]> {
    return this.getTickets('Resolved' as unknown as undefined, 'Resolved').pipe(
      map(tickets =>
        tickets.map(ticket => ({
          ...ticket,
          resolvedAt: null
        }))
      )
    );
  }

  /**
   * Fetch a single ticket by ID
   * Endpoint: GET /api/v1/admin/tickets (filter client-side, or use reporter endpoint)
   * Falls back to the reporter /api/v1/tickets/{id} endpoint since admin has no single-ticket GET
   */
  getTicketById(id: number): Observable<Ticket | undefined> {
    return this.http
      .get<Ticket>(`${environment.apiBaseUrl}/tickets/${id}`)
      .pipe(map(ticket => ticket ?? undefined));
  }

  /**
   * Assign a technician to a ticket (transitions status to Assigned)
   * Endpoint: PATCH /api/v1/admin/tickets/{id}/assign
   */
  assignTechnician(ticketId: number, technicianId: number): Observable<AdminTicketResponse> {
    return this.http.patch<AdminTicketResponse>(
      `${this.baseUrl}/${ticketId}/assign`,
      { technicianID: technicianId }
    );
  }

  /**
   * Update ticket status
   * Endpoint: PATCH /api/v1/admin/tickets/{id}/status
   */
  updateStatus(ticketId: number, status: string): Observable<AdminTicketResponse> {
    return this.http.patch<AdminTicketResponse>(
      `${this.baseUrl}/${ticketId}/status`,
      { status }
    );
  }
}