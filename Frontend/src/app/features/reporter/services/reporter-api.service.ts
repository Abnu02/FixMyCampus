import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

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
  private mockCampuses: Campus[] = [
    { id: 1, name: 'Main Campus', location: '100 University Ave' },
    { id: 2, name: 'Downtown Campus', location: '450 City Center Plaza' },
    { id: 3, name: 'Innovation & Tech Campus', location: '800 Innovation Blvd' }
  ];

  private mockBuildings: Building[] = [
    {
      id: 1,
      name: 'Engineering Hall',
      campusId: 1,
      number: 101,
      rooms: 120 // Has rooms 1 - 120
    },
    {
      id: 2,
      name: 'Student Life Center',
      campusId: 1,
      number: 102,
      rooms: 45 // Has rooms 1 - 45
    },
    {
      id: 3,
      name: 'Library & Information Commons',
      campusId: 2,
      number: 201,
      rooms: 80 // Has rooms 1 - 80
    },
    {
      id: 4,
      name: 'Business Administration Building',
      campusId: 2,
      number: 202,
      rooms: 100 // Has rooms 1 - 100
    },
    {
      id: 5,
      name: 'Research & Biotech Complex',
      campusId: 3,
      number: 301,
      rooms: 60 // Has rooms 1 - 60
    }
  ];

  private mockTickets: TicketDetails[] = [
    {
      id: 101,
      category: 'Electrical',
      buildingId: 1,
      buildingName: 'Engineering Hall',
      campusName: 'Main Campus',
      room: 24,
      description: 'Power outlets on the west wall are sparking and not delivering power to workstations.',
      status: 'Assigned',
      technicianName: 'Alex Morales',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      history: [
        {
          fromStatus: null,
          toStatus: 'New',
          changedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        },
        {
          fromStatus: 'New',
          toStatus: 'Assigned',
          changedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
        }
      ]
    },
    {
      id: 102,
      category: 'Plumbing',
      buildingId: 3,
      buildingName: 'Library & Information Commons',
      campusName: 'Downtown Campus',
      room: 15,
      description: 'Water leaking from the ceiling tiles near the study carrels on the 2nd floor.',
      status: 'New',
      technicianName: null,
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      history: [
        {
          fromStatus: null,
          toStatus: 'New',
          changedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
        }
      ]
    },
    {
      id: 103,
      category: 'Internet',
      buildingId: 5,
      buildingName: 'Research & Biotech Complex',
      campusName: 'Innovation & Tech Campus',
      room: 42,
      description: 'Wi-Fi access point frequent drops during data synchronization and server connection timeouts.',
      status: 'In Progress',
      technicianName: 'Sarah Chen',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      history: [
        {
          fromStatus: null,
          toStatus: 'New',
          changedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
        },
        {
          fromStatus: 'New',
          toStatus: 'Assigned',
          changedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
        },
        {
          fromStatus: 'Assigned',
          toStatus: 'In Progress',
          changedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
        }
      ]
    },
    {
      id: 104,
      category: 'Furniture',
      buildingId: 2,
      buildingName: 'Student Life Center',
      campusName: 'Main Campus',
      room: 12,
      description: 'Two study desks have broken legs and are currently unbalanced and unsafe to use.',
      status: 'Resolved',
      technicianName: 'Marcus Johnson',
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      history: [
        {
          fromStatus: null,
          toStatus: 'New',
          changedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
        },
        {
          fromStatus: 'New',
          toStatus: 'Assigned',
          changedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
        },
        {
          fromStatus: 'Assigned',
          toStatus: 'Resolved',
          changedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
        }
      ]
    },
    {
      id: 105,
      category: 'Cleaning',
      buildingId: 4,
      buildingName: 'Business Administration Building',
      campusName: 'Downtown Campus',
      room: 88,
      description: 'Spilled coffee across rows 3 and 4 after morning lecture session.',
      status: 'New',
      technicianName: null,
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      history: [
        {
          fromStatus: null,
          toStatus: 'New',
          changedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
        }
      ]
    }
  ];

  getCampuses(): Observable<Campus[]> {
    return of([...this.mockCampuses]).pipe(delay(150));
  }

  getBuildings(campusId?: number): Observable<Building[]> {
    const list = campusId !== undefined
      ? this.mockBuildings.filter(b => b.campusId === campusId)
      : this.mockBuildings;

    return of([...list]).pipe(delay(150));
  }

  getTickets(): Observable<TicketListItem[]> {
    const items: TicketListItem[] = this.mockTickets.map(t => ({
      id: t.id,
      category: t.category,
      buildingId: t.buildingId,
      buildingName: t.buildingName,
      campusName: t.campusName,
      room: t.room,
      status: t.status,
      createdAt: t.createdAt
    }));

    return of(items).pipe(delay(200));
  }

  getMyTickets(): Observable<TicketListItem[]> {
    const items: TicketListItem[] = this.mockTickets.map(t => ({
      id: t.id,
      category: t.category,
      buildingId: t.buildingId,
      buildingName: t.buildingName,
      campusName: t.campusName,
      room: t.room,
      status: t.status,
      createdAt: t.createdAt
    }));

    return of(items).pipe(delay(200));
  }

  getTicket(id: number): Observable<TicketDetails> {
    const ticket = this.mockTickets.find(t => t.id === id);
    if (!ticket) {
      return throwError(() => new Error(`Ticket #${id} not found`));
    }
    return of({ ...ticket }).pipe(delay(200));
  }

  createTicket(request: CreateTicketRequest): Observable<TicketDetails> {
    const building = this.mockBuildings.find(b => b.id === request.buildingId);
    if (!building) {
      return throwError(() => new Error('Selected building does not exist.'));
    }

    if (request.room < 1 || request.room > building.rooms) {
      return throwError(
        () => new Error(`Room number ${request.room} is invalid. ${building.name} only has rooms 1 to ${building.rooms}.`)
      );
    }

    const campus = this.mockCampuses.find(c => c.id === building.campusId);
    const nextId = this.mockTickets.length > 0 ? Math.max(...this.mockTickets.map(t => t.id)) + 1 : 101;
    const now = new Date().toISOString();

    const newTicket: TicketDetails = {
      id: nextId,
      category: request.category,
      buildingId: request.buildingId,
      buildingName: building.name,
      campusName: campus?.name ?? 'Unknown Campus',
      room: Number(request.room),
      description: request.description,
      status: 'New',
      technicianName: null,
      createdAt: now,
      history: [
        {
          fromStatus: null,
          toStatus: 'New',
          changedAt: now
        }
      ]
    };

    this.mockTickets.unshift(newTicket);

    return of({ ...newTicket }).pipe(delay(250));
  }
}