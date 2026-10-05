export interface TicketListItem {
  id: number;
  category: string;
  buildingName: string;
  campusName: string;
  room: string;
  status: string;
  createdAt: string;
}

export interface TicketDetails {
  id: number;
  category: string;
  buildingName: string;
  campusName: string;
  room: string;
  description: string;
  technicianId: number | null;
  status: string;
  createdAt: string;
  history: TicketHistoryItem[];
}

export interface TicketHistoryItem {
  fromStatus: string | null;
  toStatus: string;
  changedAt: string;
}

export interface CreateTicketRequest {
  category: string;
  buildingId: number;
  room: string;
  description: string;
}