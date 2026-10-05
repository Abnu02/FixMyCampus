export enum TicketStatus {
  New = 'New',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Resolved = 'Resolved'
}

export interface TicketHistoryItem {
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
}

export interface Ticket {
  id: number;
  category: string;
  buildingId: number;
  buildingName: string;
  campusName: string;
  room: string;
  description: string;
  technicianType?: string;
  technicianName?: string | null;
  status: TicketStatus;
  createdAt: string;
  history?: TicketHistoryItem[];
}

export interface ResolvedTicket extends Ticket {
  resolvedAt: string | null;
}

export interface TechnicianCategory {
  type: string;
  technicians: string[];
}