export enum TicketStatus {
  New = 'New',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Resolved = 'Resolved'
}

export interface Ticket {
  id: number;
  category: string;
  buildingId: number;
  buildingName: string;
  campusName: string;
  room: string;
  description: string;
  technicianName?: string;
  status: TicketStatus;
  createdAt: string;
}

export interface TicketStatSummary {
  totalActive: number;
  needsTechnician: number;
  underRepair: number;
  resolved: number;
}