import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Technician } from '../models/technician.model';

@Injectable({
  providedIn: 'root'
})
export class AdminStoreService {
  // 5 Initial Mock Technicians
  private technicians: Technician[] = [
    {
      id: 1,
      firstName: 'Abebe',
      lastName: 'Bikila',
      email: 'abebe.bikila@university.edu',
      category: 'Electrical',
      isActive: true,
      createdAt: '2026-01-10T08:30:00Z'
    },
    {
      id: 2,
      firstName: 'Kebede',
      lastName: 'Tessema',
      email: 'kebede.t@university.edu',
      category: 'Plumbing',
      isActive: true,
      createdAt: '2026-01-15T10:15:00Z'
    },
    {
      id: 3,
      firstName: 'Marta',
      lastName: 'Hailu',
      email: 'marta.h@university.edu',
      category: 'IT Infrastructure',
      isActive: true,
      createdAt: '2026-02-01T09:00:00Z'
    },
    {
      id: 4,
      firstName: 'Almaz',
      lastName: 'Ayana',
      email: 'almaz.a@university.edu',
      category: 'Hardware Maintenance',
      isActive: false,
      createdAt: '2026-02-20T14:45:00Z'
    },
    {
      id: 5,
      firstName: 'Dawit',
      lastName: 'Girma',
      email: 'dawit.g@university.edu',
      category: 'Carpentry',
      isActive: true,
      createdAt: '2026-03-05T11:20:00Z'
    }
  ];

  // --- TECHNICIAN CRUD ---

  getTechnicians(category?: string): Observable<Technician[]> {
    if (category && category !== 'All') {
      return of(this.technicians.filter(t => t.category === category));
    }
    return of([...this.technicians]);
  }

  getTechnicianById(id: number): Observable<Technician | undefined> {
    return of(this.technicians.find(t => t.id === id));
  }

  createTechnician(tech: Omit<Technician, 'id' | 'isActive'>): Observable<Technician> {
    const newTechnician: Technician = {
      id: this.technicians.length ? Math.max(...this.technicians.map(t => t.id)) + 1 : 1,
      firstName: tech.firstName,
      lastName: tech.lastName,
      email: tech.email,
      category: tech.category,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.technicians.push(newTechnician);
    return of(newTechnician);
  }

  updateTechnician(id: number, techData: Partial<Technician>): Observable<Technician> {
    const index = this.technicians.findIndex(t => t.id === id);
    if (index !== -1) {
      this.technicians[index] = { ...this.technicians[index], ...techData };
      return of(this.technicians[index]);
    }
    throw new Error('Technician not found');
  }

  toggleTechnicianStatus(id: number): Observable<Technician> {
    const tech = this.technicians.find(t => t.id === id);
    if (tech) {
      tech.isActive = !tech.isActive;
      return of(tech);
    }
    throw new Error('Technician not found');
  }
}