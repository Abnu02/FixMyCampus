import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ReporterApiService } from '../../services/reporter-api.service';
import { Campus } from '../../models/campus.model';
import { Building } from '../../models/building.model';
import { ReporterNavComponent } from '../../components/reporter-nav/reporter-nav';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReporterNavComponent],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css'
})
export class CreateTicketComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ReporterApiService);
  private readonly router = inject(Router);

  campuses: Campus[] = [];
  buildings: Building[] = [];

  loading = false;
  submitting = false;
  errorMessage = '';

  readonly categories = [
    'Electrical',
    'Plumbing',
    'Cleaning',
    'Furniture',
    'Internet',
    'Other'
  ];

  readonly form = this.fb.group({
    category: ['', Validators.required],
    campusId: ['', Validators.required],
    buildingId: ['', Validators.required],
    room: ['', [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit(): void {
    this.loadCampuses();
  }

  loadCampuses(): void {
    this.loading = true;

    this.api.getCampuses().subscribe({
      next: (campuses) => {
        this.campuses = campuses;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load campuses.';
        this.loading = false;
      }
    });
  }

  onCampusChange(): void {
    const campusId = this.form.controls.campusId.value;

    this.form.controls.buildingId.setValue('');
    this.form.controls.room.setValue('');
    this.buildings = [];

    if (!campusId) {
      return;
    }

    this.api.getBuildings(Number(campusId)).subscribe({
      next: (buildings) => {
        this.buildings = buildings;
      },
      error: () => {
        this.errorMessage = 'Unable to load buildings.';
      }
    });
  }

  onBuildingChange(): void {
    this.form.controls.room.setValue('');
    const maxRooms = this.getSelectedBuildingMaxRooms();

    if (maxRooms) {
      this.form.controls.room.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxRooms)
      ]);
    } else {
      this.form.controls.room.setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    }
    this.form.controls.room.updateValueAndValidity();
  }

  getSelectedBuilding(): Building | undefined {
    const buildingId = Number(this.form.controls.buildingId.value);
    if (!buildingId) {
      return undefined;
    }
    return this.buildings.find(b => b.id === buildingId);
  }

  getSelectedBuildingMaxRooms(): number | null {
    const building = this.getSelectedBuilding();
    return building ? building.rooms : null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const request = {
      category: this.form.controls.category.value ?? '',
      buildingId: Number(this.form.controls.buildingId.value),
      room: Number(this.form.controls.room.value),
      description: this.form.controls.description.value ?? ''
    };

    this.api.createTicket(request).subscribe({
      next: (ticket) => {
        this.submitting = false;

        this.router.navigate([
          '/reporter/tickets',
          ticket.id
        ]);
      },
      error: (err) => {
        this.errorMessage = err?.message || 'Unable to create the ticket.';
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/reporter']);
  }
}