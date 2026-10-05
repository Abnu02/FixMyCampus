import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Technician } from '../models/technician.model';
import { AdminStoreService } from './admin-Technician-store.service';

@Injectable({
  providedIn: 'root'
})
export class AdminTechnicianService {
  // Toggle between local store and backend API endpoints
  private useMock = true;

  // Base API URL
  private readonly baseUrl = '/api/v1';

  constructor(
    private http: HttpClient,
    private adminStore: AdminStoreService
  ) {}

  /**
   * GET /api/v1/technicians
   * Optional category filter: GET /api/v1/technicians?category=Electrical
   */
  getTechnicians(category?: string): Observable<Technician[]> {
    if (this.useMock) {
      return this.adminStore.getTechnicians(category);
    }
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    return this.http.get<Technician[]>(`${this.baseUrl}/technicians`, { params });
  }

  /** GET /api/v1/technicians/{id} */
  getTechnicianById(id: number): Observable<Technician | undefined> {
    if (this.useMock) {
      return this.adminStore.getTechnicianById(id);
    }
    return this.http.get<Technician>(`${this.baseUrl}/technicians/${id}`);
  }

  /** POST /api/v1/technicians */
  createTechnician(technician: Omit<Technician, 'id' | 'isActive'>): Observable<Technician> {
    if (this.useMock) {
      return this.adminStore.createTechnician(technician);
    }
    return this.http.post<Technician>(`${this.baseUrl}/technicians`, technician);
  }

  /** PUT /api/v1/technicians/{id} */
  updateTechnician(id: number, technician: Partial<Technician>): Observable<Technician> {
    if (this.useMock) {
      return this.adminStore.updateTechnician(id, technician);
    }
    return this.http.put<Technician>(`${this.baseUrl}/technicians/${id}`, technician);
  }

  /** PATCH /api/v1/technicians/{id}/status */
  toggleTechnicianStatus(id: number): Observable<Technician> {
    if (this.useMock) {
      return this.adminStore.toggleTechnicianStatus(id);
    }
    return this.http.patch<Technician>(`${this.baseUrl}/technicians/${id}/status`, {});
  }
}