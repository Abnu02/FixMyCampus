import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campus, Building } from '../models/campus.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminCampusService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // --- CAMPUS ENDPOINTS ---

  /** GET /api/v1/campuses */
  getCampuses(): Observable<Campus[]> {
    return this.http.get<Campus[]>(`${this.baseUrl}/campuses`);
  }

  /** GET /api/v1/campuses/{id} */
  getCampusById(id: number): Observable<Campus> {
    return this.http.get<Campus>(`${this.baseUrl}/campuses/${id}`);
  }

  // --- BUILDING ENDPOINTS ---

  /**
   * GET /api/v1/buildings
   * Optional campus filter: GET /api/v1/buildings?campusId=1
   */
  getBuildings(campusId?: number): Observable<Building[]> {
    let params = new HttpParams();
    if (campusId) {
      params = params.set('campusId', campusId.toString());
    }
    return this.http.get<Building[]>(`${this.baseUrl}/buildings`, { params });
  }

  /** GET /api/v1/buildings/{id} */
  getBuildingById(id: number): Observable<Building> {
    return this.http.get<Building>(`${this.baseUrl}/buildings/${id}`);
  }
}