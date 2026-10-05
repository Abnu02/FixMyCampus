export interface TicketListItem {
  id: number;
  category: string;
  buildingId: number;
  buildingName: string;
  campusName: string;
  room: number;
  status: string;
  createdAt: string;
}

export interface TicketDetails {
  id: number;
  category: string;
  buildingId: number;
  buildingName: string;
  campusName: string;
  room: number;
  description: string;
  technicianName: string | null;
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
  room: number;
  description: string;
}