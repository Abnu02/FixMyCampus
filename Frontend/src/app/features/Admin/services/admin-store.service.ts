import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ResolvedTicket, Ticket, TicketStatus, TechnicianCategory } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class AdminStoreService {
  private technicianCategories: TechnicianCategory[] = [
    { type: 'Electrical Specialist', technicians: ['Abebe Kebede', 'Dawit Seyoum', 'Elias Tadesse'] },
    { type: 'Plumbing & Water Specialist', technicians: ['Mulugeta Tesfaye', 'Biniyam Girma'] },
    { type: 'IT & Network Engineer', technicians: ['Hassina Mohammed', 'Yared Alemu', 'Sami Bekele'] },
    { type: 'Carpentry & Facilities Specialist', technicians: ['Kassahun Worku', 'Tewodros Solomon'] }
  ];

  private tickets: Ticket[] = [
    {
      id: 1,
      category: 'Electrical',
      buildingId: 1,
      buildingName: 'Block A',
      campusName: 'Main Campus',
      room: '204',
      description: 'Power outlet is short-circuiting and giving off sparks when turning on light switch.',
      technicianType: undefined,
      technicianName: null,
      status: TicketStatus.New,
      createdAt: '2026-10-05T10:30:00Z',
      history: [{ fromStatus: null, toStatus: 'New', changedAt: '2026-10-05T10:30:00Z' }]
    },
    {
      id: 2,
      category: 'Plumbing',
      buildingId: 1,
      buildingName: 'Block A',
      campusName: 'Main Campus',
      room: '102',
      description: 'Main water line leaking in the staff restroom, causing water to pool on the floor.',
      technicianType: undefined,
      technicianName: null,
      status: TicketStatus.New,
      createdAt: '2026-10-05T09:15:00Z',
      history: [{ fromStatus: null, toStatus: 'New', changedAt: '2026-10-05T09:15:00Z' }]
    },
    {
      id: 3,
      category: 'IT Infrastructure',
      buildingId: 2,
      buildingName: 'Block B',
      campusName: 'Main Campus',
      room: 'Lab 3',
      description: 'Ceiling network router lost power; entire computer lab is offline.',
      technicianType: 'IT & Network Engineer',
      technicianName: 'Sami Bekele',
      status: TicketStatus.Assigned,
      createdAt: '2026-10-05T08:00:00Z',
      history: [
        { fromStatus: null, toStatus: 'New', changedAt: '2026-10-05T08:00:00Z' },
        { fromStatus: 'New', toStatus: 'Assigned', changedAt: '2026-10-05T08:45:00Z' }
      ]
    },
    {
      id: 4,
      category: 'Hardware Maintenance',
      buildingId: 3,
      buildingName: 'Technology Center',
      campusName: 'Technology Campus',
      room: 'Hall 101',
      description: 'Main overhead projector HDMI port damaged and screen flickering during lectures.',
      technicianType: 'IT & Network Engineer',
      technicianName: 'Hassina Mohammed',
      status: TicketStatus.InProgress,
      createdAt: '2026-10-04T14:20:00Z',
      history: [
        { fromStatus: null, toStatus: 'New', changedAt: '2026-10-04T14:20:00Z' },
        { fromStatus: 'New', toStatus: 'Assigned', changedAt: '2026-10-04T15:00:00Z' },
        { fromStatus: 'Assigned', toStatus: 'InProgress', changedAt: '2026-10-04T15:30:00Z' }
      ]
    },
    {
      id: 5,
      category: 'Electrical',
      buildingId: 3,
      buildingName: 'Technology Center',
      campusName: 'Technology Campus',
      room: '302',
      description: 'Air conditioning unit blowing hot air and producing high-pitched buzzing sound.',
      technicianType: 'Electrical Specialist',
      technicianName: 'Abebe Kebede',
      status: TicketStatus.Resolved,
      createdAt: '2026-10-03T11:00:00Z',
      history: [
        { fromStatus: null, toStatus: 'New', changedAt: '2026-10-03T11:00:00Z' },
        { fromStatus: 'New', toStatus: 'Assigned', changedAt: '2026-10-03T11:45:00Z' },
        { fromStatus: 'Assigned', toStatus: 'InProgress', changedAt: '2026-10-03T12:30:00Z' },
        { fromStatus: 'InProgress', toStatus: 'Resolved', changedAt: '2026-10-03T16:00:00Z' }
      ]
    },
    {
      id: 6,
      category: 'Carpentry',
      buildingId: 1,
      buildingName: 'Block A',
      campusName: 'Main Campus',
      room: 'Auditorium B',
      description: 'Front stage wooden steps cracked and poses safety hazard for presenters.',
      technicianType: undefined,
      technicianName: null,
      status: TicketStatus.New,
      createdAt: '2026-10-05T11:10:00Z',
      history: [{ fromStatus: null, toStatus: 'New', changedAt: '2026-10-05T11:10:00Z' }]
    },
    {
      id: 7,
      category: 'Plumbing',
      buildingId: 2,
      buildingName: 'Block B',
      campusName: 'Main Campus',
      room: '210',
      description: 'Clogged drainage in chemistry lab sink causing water backup into counters.',
      technicianType: 'Plumbing & Water Specialist',
      technicianName: 'Mulugeta Tesfaye',
      status: TicketStatus.Assigned,
      createdAt: '2026-10-05T07:30:00Z',
      history: [
        { fromStatus: null, toStatus: 'New', changedAt: '2026-10-05T07:30:00Z' },
        { fromStatus: 'New', toStatus: 'Assigned', changedAt: '2026-10-05T08:15:00Z' }
      ]
    },
    {
      id: 8,
      category: 'Electrical',
      buildingId: 2,
      buildingName: 'Block B',
      campusName: 'Main Campus',
      room: 'Library 2F',
      description: 'Multiple overhead LED panel lights burnt out in quiet study zone.',
      technicianType: undefined,
      technicianName: null,
      status: TicketStatus.New,
      createdAt: '2026-10-05T12:00:00Z',
      history: [{ fromStatus: null, toStatus: 'New', changedAt: '2026-10-05T12:00:00Z' }]
    },
    {
      id: 9,
      category: 'IT Infrastructure',
      buildingId: 3,
      buildingName: 'Technology Center',
      campusName: 'Technology Campus',
      room: 'Server Room',
      description: 'Backup Ethernet switch port failure on Rack 4.',
      technicianType: 'IT & Network Engineer',
      technicianName: 'Yared Alemu',
      status: TicketStatus.InProgress,
      createdAt: '2026-10-04T09:00:00Z',
      history: [
        { fromStatus: null, toStatus: 'New', changedAt: '2026-10-04T09:00:00Z' },
        { fromStatus: 'New', toStatus: 'Assigned', changedAt: '2026-10-04T09:30:00Z' },
        { fromStatus: 'Assigned', toStatus: 'InProgress', changedAt: '2026-10-04T10:15:00Z' }
      ]
    },
    {
      id: 10,
      category: 'Carpentry',
      buildingId: 1,
      buildingName: 'Block A',
      campusName: 'Main Campus',
      room: 'Dean Office',
      description: 'Door lock cylinder jamming; difficult to lock from outside.',
      technicianType: 'Carpentry & Facilities Specialist',
      technicianName: 'Tewodros Solomon',
      status: TicketStatus.Resolved,
      createdAt: '2026-10-02T15:40:00Z',
      history: [
        { fromStatus: null, toStatus: 'New', changedAt: '2026-10-02T15:40:00Z' },
        { fromStatus: 'New', toStatus: 'Assigned', changedAt: '2026-10-02T16:10:00Z' },
        { fromStatus: 'Assigned', toStatus: 'InProgress', changedAt: '2026-10-03T09:00:00Z' },
        { fromStatus: 'InProgress', toStatus: 'Resolved', changedAt: '2026-10-03T11:30:00Z' }
      ]
    }
  ];

  getTickets(): Observable<Ticket[]> {
    return of([...this.tickets]);
  }

  getTicketById(id: number): Observable<Ticket | undefined> {
    const ticket = this.tickets.find(t => t.id === id);
    return of(ticket ? { ...ticket } : undefined);
  }

  getTechnicianCategories(): Observable<TechnicianCategory[]> {
    return of(this.technicianCategories);
  }

  assignTechnician(ticketId: number, technicianType: string, technicianName: string): Observable<Ticket> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const oldStatus = ticket.status;
    ticket.technicianType = technicianType;
    ticket.technicianName = technicianName;
    ticket.status = TicketStatus.Assigned;

    if (!ticket.history) ticket.history = [];
    ticket.history.push({
      fromStatus: oldStatus,
      toStatus: TicketStatus.Assigned,
      changedAt: new Date().toISOString()
    });

    return of({ ...ticket });
  }
  getResolvedTickets(): Observable<ResolvedTicket[]> {
    const resolvedTickets = this.tickets
      .filter(ticket => ticket.status === TicketStatus.Resolved)
      .map(ticket => {
        const resolvedEntry = ticket.history?.find(
          item => item.toStatus === TicketStatus.Resolved
        );
        return {
          ...ticket,
          resolvedAt: resolvedEntry?.changedAt ?? null
        };
      });

    return of(resolvedTickets);
  }
}