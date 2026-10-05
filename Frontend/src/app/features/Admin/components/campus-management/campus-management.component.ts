import { Component, OnInit } from '@angular/core';
import { AdminCampusService } from '../../services/admin-campus.service';
import { Campus, Building } from '../../models/campus.model';

@Component({
  selector: 'app-campus-management',
  standalone: false,
  templateUrl: './campus-management.component.html',
  styleUrls: ['./campus-management.component.css']
})
export class CampusManagementComponent implements OnInit {
  campuses: Campus[] = [];
  buildings: Building[] = [];
  selectedCampus: Campus | null = null;

  // Campus Form State
  isCampusModalOpen = false;
  isCampusEdit = false;
  campusForm: { id?: number; name: string; location: string | number } = { name: '', location: '' };

  // Building Form State
  isBuildingModalOpen = false;
  isBuildingEdit = false;
  buildingForm: { id?: number; name: string; maxCapacity: number; campusId: number } = { name: '', maxCapacity: 0, campusId: 0 };

  constructor(private campusService: AdminCampusService) {}

  ngOnInit(): void {
    this.loadCampuses();
  }

  // --- CAMPUS OPERATIONS ---
  loadCampuses(): void {
    this.campusService.getCampuses().subscribe(data => {
      this.campuses = data;
      if (!this.selectedCampus && this.campuses.length > 0) {
        this.selectCampus(this.campuses[0]);
      }
    });
  }

  selectCampus(campus: Campus): void {
    this.selectedCampus = campus;
    this.loadBuildingsForCampus(campus.id);
  }

  openCampusModal(campus?: Campus): void {
    if (campus) {
      this.isCampusEdit = true;
      this.campusForm = { id: campus.id, name: campus.name, location: campus.location };
    } else {
      this.isCampusEdit = false;
      this.campusForm = { name: '', location: '' };
    }
    this.isCampusModalOpen = true;
  }

  closeCampusModal(): void {
    this.isCampusModalOpen = false;
  }

  saveCampus(): void {
    if (!this.campusForm.name || !this.campusForm.location) return;

    if (this.isCampusEdit && this.campusForm.id) {
      this.campusService.updateCampus(this.campusForm.id, {
        name: this.campusForm.name,
        location: this.campusForm.location
      }).subscribe(() => {
        this.loadCampuses();
        this.closeCampusModal();
      });
    } else {
      this.campusService.createCampus({
        name: this.campusForm.name,
        location: this.campusForm.location
      }).subscribe(() => {
        this.loadCampuses();
        this.closeCampusModal();
      });
    }
  }

  deleteCampus(id: number): void {
    if (confirm('Are you sure you want to delete this campus and its buildings?')) {
      this.campusService.deleteCampus(id).subscribe(() => {
        if (this.selectedCampus?.id === id) {
          this.selectedCampus = null;
          this.buildings = [];
        }
        this.loadCampuses();
      });
    }
  }

  // --- BUILDING OPERATIONS ---
  loadBuildingsForCampus(campusId: number): void {
    this.campusService.getBuildings(campusId).subscribe(data => {
      this.buildings = data;
    });
  }

  openBuildingModal(building?: Building): void {
    if (building) {
      this.isBuildingEdit = true;
      this.buildingForm = {
        id: building.id,
        name: building.name,
        maxCapacity: building.maxCapacity,
        campusId: building.campusId
      };
    } else {
      this.isBuildingEdit = false;
      this.buildingForm = {
        name: '',
        maxCapacity: 50,
        campusId: this.selectedCampus ? this.selectedCampus.id : (this.campuses[0]?.id || 0)
      };
    }
    this.isBuildingModalOpen = true;
  }

  closeBuildingModal(): void {
    this.isBuildingModalOpen = false;
  }

  saveBuilding(): void {
    if (!this.buildingForm.name || !this.buildingForm.campusId) return;

    if (this.isBuildingEdit && this.buildingForm.id) {
      this.campusService.updateBuilding(this.buildingForm.id, {
        name: this.buildingForm.name,
        maxCapacity: Number(this.buildingForm.maxCapacity),
        campusId: Number(this.buildingForm.campusId)
      }).subscribe(() => {
        if (this.selectedCampus) {
          this.loadBuildingsForCampus(this.selectedCampus.id);
        }
        this.closeBuildingModal();
      });
    } else {
      this.campusService.createBuilding({
        name: this.buildingForm.name,
        maxCapacity: Number(this.buildingForm.maxCapacity),
        campusId: Number(this.buildingForm.campusId)
      }).subscribe(() => {
        if (this.selectedCampus) {
          this.loadBuildingsForCampus(this.selectedCampus.id);
        }
        this.closeBuildingModal();
      });
    }
  }

  deleteBuilding(id: number): void {
    if (confirm('Are you sure you want to delete this building?')) {
      this.campusService.deleteBuilding(id).subscribe(() => {
        if (this.selectedCampus) {
          this.loadBuildingsForCampus(this.selectedCampus.id);
        }
      });
    }
  }
}