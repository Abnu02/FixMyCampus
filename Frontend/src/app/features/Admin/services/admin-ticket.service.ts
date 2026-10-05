// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Ticket, TicketStatSummary } from '../models/ticket.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminTicketService {
//   private apiUrl = '/api/v1/admin/tickets';

//   constructor(private http: HttpClient) {}

//   getTickets(filters?: { status?: string; buildingId?: number; category?: string }): Observable<Ticket[]> {
//     let params = new HttpParams();
//     if (filters?.status) params = params.set('status', filters.status);
//     if (filters?.buildingId) params = params.set('buildingId', filters.buildingId.toString());
//     return this.http.get<Ticket[]>(this.apiUrl, { params });
//   }

//   assignTechnician(ticketId: number, technicianName: string): Observable<Ticket> {
//     return this.http.patch<Ticket>(`${this.apiUrl}/${ticketId}/assign`, { technicianName });
//   }

//   updateStatus(ticketId: number, status: string): Observable<Ticket> {
//     return this.http.patch<Ticket>(`${this.apiUrl}/${ticketId}/status`, { status });
//   }
// }