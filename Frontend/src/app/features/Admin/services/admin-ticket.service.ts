import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResolvedTicket, Ticket, TechnicianCategory } from '../models/ticket.model';
import { AdminStoreService } from './admin-store.service';

@Injectable({
  providedIn: 'root'
})
export class AdminTicketService {
  // Flag to toggle between local mock store and backend API endpoints
  private useMock = true;

  // Base API URL provided by backend team
  private readonly baseUrl = '/api/v1';

  constructor(
    private http: HttpClient,
    private adminStore: AdminStoreService
  ) {}

  /**
   * Fetch all tickets
   * Endpoint: GET /api/v1/tickets
   */
  getTickets(): Observable<Ticket[]> {
    if (this.useMock) {
      return this.adminStore.getTickets();
    }
    return this.http.get<Ticket[]>(`${this.baseUrl}/tickets`);
  }

  /**
   * Fetch resolved ticket history with resolved timestamps
   * Endpoint: GET /api/v1/tickets/history/resolved
   */
  getResolvedTickets(): Observable<ResolvedTicket[]> {
    if (this.useMock) {
      return this.adminStore.getResolvedTickets();
    }
    return this.http.get<ResolvedTicket[]>(`${this.baseUrl}/tickets/history/resolved`);
  }

  /**
   * Fetch single ticket details by ID with history
   * Endpoint: GET /api/v1/tickets/{id}
   */
  getTicketById(id: number): Observable<Ticket | undefined> {
    if (this.useMock) {
      return this.adminStore.getTicketById(id);
    }
    return this.http.get<Ticket>(`${this.baseUrl}/tickets/${id}`);
  }

  /**
   * Fetch available technician types and their grouped technicians
   * Endpoint: GET /api/v1/technicians/categories
   */
  getTechnicianCategories(): Observable<TechnicianCategory[]> {
    if (this.useMock) {
      return this.adminStore.getTechnicianCategories();
    }
    return this.http.get<TechnicianCategory[]>(`${this.baseUrl}/technicians/categories`);
  }

  /**
   * Assign a technician to a ticket (updates status to 'Assigned')
   * Endpoint: PUT /api/v1/tickets/{id}/assign
   */
  assignTechnician(
    ticketId: number, 
    technicianType: string, 
    technicianName: string
  ): Observable<Ticket> {
    if (this.useMock) {
      return this.adminStore.assignTechnician(ticketId, technicianType, technicianName);
    }
    
    const payload = {
      technicianType,
      technicianName,
      status: 'Assigned'
    };
    
    return this.http.put<Ticket>(`${this.baseUrl}/tickets/${ticketId}/assign`, payload);
  }
}