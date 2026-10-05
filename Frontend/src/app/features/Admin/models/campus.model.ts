export interface Campus {
  id: number;
  name: string;
  location: string | number;
}

export interface Building {
  id: number;
  name: string;
  maxCapacity: number;
  campusId: number;
}