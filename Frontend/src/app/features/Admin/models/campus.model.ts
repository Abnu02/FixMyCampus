/** Matches backend CampusResponseDto */
export interface Campus {
  id: number;
  name: string;
  location: string;
}

/** Matches backend BuildingResponseDto */
export interface Building {
  id: number;
  name: string;
  campusId: number;
  campusName: string;
}