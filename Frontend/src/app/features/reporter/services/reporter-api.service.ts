import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Campus } from '../models/campus.model';
import { Building } from '../models/building.model';
import {
  CreateTicketRequest,
  TicketDetails,
  TicketListItem
} from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class ReporterApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiBaseUrl;

  /* ── Campus ───────────────────────────────── */

  getCampuses(): Observable<Campus[]> {
    return this.http.get<Campus[]>(`${this.apiUrl}/campuses`);
  }

  /* ── Building ─────────────────────────────── */

  getBuildings(campusId?: number): Observable<Building[]> {
    let params = new HttpParams();

    if (campusId !== undefined) {
      params = params.set('campusId', campusId);
    }

    return this.http.get<Building[]>(`${this.apiUrl}/buildings`, { params });
  }

  /* ── Tickets ──────────────────────────────── */

  getTickets(): Observable<TicketListItem[]> {
    return this.http.get<TicketListItem[]>(`${this.apiUrl}/tickets`);
  }

  getMyTickets(): Observable<TicketListItem[]> {
    return this.http.get<TicketListItem[]>(`${this.apiUrl}/tickets/my`);
  }

  getTicket(id: number): Observable<TicketDetails> {
    return this.http.get<TicketDetails>(`${this.apiUrl}/tickets/${id}`);
  }

  createTicket(request: CreateTicketRequest): Observable<TicketDetails> {
    return this.http.post<TicketDetails>(`${this.apiUrl}/tickets`, request);
  }
}