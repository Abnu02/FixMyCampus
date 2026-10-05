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

/**
 * Matches backend AdminTicketResponse DTO
 */
export interface AdminTicketResponse {
  id: number;
  category: string;
  buildingName: string;
  room: string;
  description: string;
  technicianID: number | null;
  status: string;
  createdAt: string;
}

/**
 * Extended view model used by components that need history
 */
export interface Ticket extends AdminTicketResponse {
  campusName?: string;
  technicianName?: string | null;
  history?: TicketHistoryItem[];
}

export interface ResolvedTicket extends Ticket {
  resolvedAt: string | null;
}

export interface TechnicianCategory {
  type: string;
  technicians: string[];
}