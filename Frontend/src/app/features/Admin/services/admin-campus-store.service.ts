import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Campus, Building } from '../models/campus.model';

@Injectable({
  providedIn: 'root'
})
export class AdminStoreService {
  // 5 Initial Mock Campuses
  private campuses: Campus[] = [
    { id: 1, name: 'Main Campus', location: 1 },
    { id: 2, name: 'Technology Campus', location: 2 },
    { id: 3, name: 'Health Sciences Campus', location: 3 },
    { id: 4, name: 'Business & Economics Campus', location: 4 },
    { id: 5, name: 'Agricultural Research Campus', location: 5 }
  ];

  // 5 Initial Mock Buildings
  private buildings: Building[] = [
    { id: 1, name: 'Block A', maxCapacity: 120, campusId: 1 },
    { id: 2, name: 'Engineering Hall', maxCapacity: 250, campusId: 2 },
    { id: 3, name: 'Medical Lab Tower', maxCapacity: 80, campusId: 3 },
    { id: 4, name: 'Auditorium Complex', maxCapacity: 500, campusId: 1 },
    { id: 5, name: 'Finance & Admin Block', maxCapacity: 150, campusId: 4 }
  ];

  // --- CAMPUS CRUD ---
  getCampuses(): Observable<Campus[]> {
    return of([...this.campuses]);
  }

  getCampusById(id: number): Observable<Campus | undefined> {
    return of(this.campuses.find(c => c.id === id));
  }

  createCampus(campus: Omit<Campus, 'id'>): Observable<Campus> {
    const newCampus: Campus = {
      id: this.campuses.length ? Math.max(...this.campuses.map(c => c.id)) + 1 : 1,
      name: campus.name,
      location: campus.location
    };
    this.campuses.push(newCampus);
    return of(newCampus);
  }

  updateCampus(id: number, campusData: Partial<Campus>): Observable<Campus> {
    const index = this.campuses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.campuses[index] = { ...this.campuses[index], ...campusData };
      return of(this.campuses[index]);
    }
    throw new Error('Campus not found');
  }

  deleteCampus(id: number): Observable<boolean> {
    this.campuses = this.campuses.filter(c => c.id !== id);
    // Remove associated buildings
    this.buildings = this.buildings.filter(b => b.campusId !== id);
    return of(true);
  }

  // --- BUILDING CRUD ---
  getBuildings(campusId?: number): Observable<Building[]> {
    if (campusId) {
      return of(this.buildings.filter(b => b.campusId === campusId));
    }
    return of([...this.buildings]);
  }

  createBuilding(building: Omit<Building, 'id'>): Observable<Building> {
    const newBuilding: Building = {
      id: this.buildings.length ? Math.max(...this.buildings.map(b => b.id)) + 1 : 1,
      name: building.name,
      maxCapacity: building.maxCapacity,
      campusId: building.campusId
    };
    this.buildings.push(newBuilding);
    return of(newBuilding);
  }

  updateBuilding(id: number, buildingData: Partial<Building>): Observable<Building> {
    const index = this.buildings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.buildings[index] = { ...this.buildings[index], ...buildingData };
      return of(this.buildings[index]);
    }
    throw new Error('Building not found');
  }

  deleteBuilding(id: number): Observable<boolean> {
    this.buildings = this.buildings.filter(b => b.id !== id);
    return of(true);
  }
}