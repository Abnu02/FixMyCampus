import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campus, Building } from '../models/campus.model';
import { AdminStoreService } from './admin-campus-store.service';

@Injectable({
  providedIn: 'root'
})
export class AdminCampusService {
  // Flag to toggle between local mock store and backend API endpoints
  private useMock = true;

  // Base API URL provided by backend team
  private readonly baseUrl = '/api/v1';

  constructor(
    private http: HttpClient,
    private adminStore: AdminStoreService
  ) {}

  // --- CAMPUS ENDPOINTS ---

  /** GET /api/v1/campuses */
  getCampuses(): Observable<Campus[]> {
    if (this.useMock) {
      return this.adminStore.getCampuses();
    }
    return this.http.get<Campus[]>(`${this.baseUrl}/campuses`);
  }

  /** POST /api/v1/campuses */
  createCampus(campus: Omit<Campus, 'id'>): Observable<Campus> {
    if (this.useMock) {
      return this.adminStore.createCampus(campus);
    }
    return this.http.post<Campus>(`${this.baseUrl}/campuses`, campus);
  }

  /** PUT /api/v1/campuses/{id} */
  updateCampus(id: number, campus: Partial<Campus>): Observable<Campus> {
    if (this.useMock) {
      return this.adminStore.updateCampus(id, campus);
    }
    return this.http.put<Campus>(`${this.baseUrl}/campuses/${id}`, campus);
  }

  /** DELETE /api/v1/campuses/{id} */
  deleteCampus(id: number): Observable<boolean> {
    if (this.useMock) {
      return this.adminStore.deleteCampus(id);
    }
    return this.http.delete<boolean>(`${this.baseUrl}/campuses/${id}`);
  }

  // --- BUILDING ENDPOINTS ---

  /** 
   * GET /api/v1/buildings
   * Optional campus filter: GET /api/v1/buildings?campusId=1
   */
  getBuildings(campusId?: number): Observable<Building[]> {
    if (this.useMock) {
      return this.adminStore.getBuildings(campusId);
    }
    let params = new HttpParams();
    if (campusId) {
      params = params.set('campusId', campusId.toString());
    }
    return this.http.get<Building[]>(`${this.baseUrl}/buildings`, { params });
  }

  /** POST /api/v1/buildings */
  createBuilding(building: Omit<Building, 'id'>): Observable<Building> {
    if (this.useMock) {
      return this.adminStore.createBuilding(building);
    }
    return this.http.post<Building>(`${this.baseUrl}/buildings`, building);
  }

  /** PUT /api/v1/buildings/{id} */
  updateBuilding(id: number, building: Partial<Building>): Observable<Building> {
    if (this.useMock) {
      return this.adminStore.updateBuilding(id, building);
    }
    return this.http.put<Building>(`${this.baseUrl}/buildings/${id}`, building);
  }

  /** DELETE /api/v1/buildings/{id} */
  deleteBuilding(id: number): Observable<boolean> {
    if (this.useMock) {
      return this.adminStore.deleteBuilding(id);
    }
    return this.http.delete<boolean>(`${this.baseUrl}/buildings/${id}`);
  }
}