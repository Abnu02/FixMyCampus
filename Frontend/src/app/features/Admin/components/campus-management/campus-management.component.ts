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

  isLoading = false;
  errorMessage = '';

  // Read-only notice (write endpoints not yet available in backend)
  readonly isReadOnly = true;

  constructor(private campusService: AdminCampusService) {}

  ngOnInit(): void {
    this.loadCampuses();
  }

  // --- CAMPUS OPERATIONS ---
  loadCampuses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('[CampusManagementComponent] Requesting campuses...');
    this.campusService.getCampuses().subscribe({
      next: data => {
        console.log('[CampusManagementComponent] Received campuses:', data);
        try {
          this.campuses = Array.isArray(data) ? data : [];
          if (!this.selectedCampus && this.campuses.length > 0) {
            this.selectCampus(this.campuses[0]);
          }
        } catch (e) {
          console.error('[CampusManagementComponent] Error processing campuses:', e);
        } finally {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('[CampusManagementComponent] Error loading campuses:', err);
        this.errorMessage = err?.error?.message || 'Campuses could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  selectCampus(campus: Campus): void {
    this.selectedCampus = campus;
    this.loadBuildingsForCampus(campus.id);
  }

  // --- BUILDING OPERATIONS ---
  loadBuildingsForCampus(campusId: number): void {
    this.campusService.getBuildings(campusId).subscribe({
      next: data => {
        this.buildings = data;
      },
      error: () => {
        this.errorMessage = 'Buildings could not be loaded.';
      }
    });
  }
}