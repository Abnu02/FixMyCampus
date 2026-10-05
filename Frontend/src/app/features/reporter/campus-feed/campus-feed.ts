import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReporterApiService } from '../services/reporter-api.service';
import { Campus } from '../models/campus.model';
import { Building } from '../models/building.model';
import { TicketListItem } from '../models/ticket.model';
import { RouterLink } from '@angular/router';
import { ReporterNavComponent } from '../reporter-nav/reporter-nav';

@Component({
  selector: 'app-campus-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReporterNavComponent],
  templateUrl: './campus-feed.html',
  styleUrl: './campus-feed.css'
})
export class CampusFeedComponent implements OnInit {
  private readonly api = inject(ReporterApiService);

  tickets: TicketListItem[] = [];
  filteredTickets: TicketListItem[] = [];

  campuses: Campus[] = [];
  buildings: Building[] = [];

  selectedCategory = '';
  selectedCampus = '';
  selectedBuilding = '';
  selectedStatus = '';

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCampuses();
    this.loadTickets();
  }

  loadCampuses(): void {
    this.api.getCampuses().subscribe({
      next: (campuses) => {
        this.campuses = campuses;
      },
      error: () => {
        this.errorMessage = 'Unable to load campuses.';
      }
    });
  }

  loadTickets(): void {
    this.loading = true;

    this.api.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load tickets.';
        this.loading = false;
      }
    });
  }

  onCampusChange(): void {
    this.selectedBuilding = '';
    this.buildings = [];

    if (!this.selectedCampus) {
      this.applyFilters();
      return;
    }

    this.api.getBuildings(Number(this.selectedCampus)).subscribe({
      next: (buildings) => {
        this.buildings = buildings;
        this.applyFilters();
      },
      error: () => {
        this.errorMessage = 'Unable to load buildings.';
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const categoryMatch =
        !this.selectedCategory ||
        ticket.category === this.selectedCategory;

      const campusMatch =
        !this.selectedCampus ||
        ticket.campusName === this.getCampusName(Number(this.selectedCampus));

      const buildingMatch =
        !this.selectedBuilding ||
        ticket.buildingName === this.getBuildingName(Number(this.selectedBuilding));

      const statusMatch =
        !this.selectedStatus ||
        this.displayStatus(ticket.status) === this.selectedStatus;

      return (
        categoryMatch &&
        campusMatch &&
        buildingMatch &&
        statusMatch
      );
    });
  }

  getCampusName(id: number): string {
    return this.campuses.find(c => c.id === id)?.name ?? '';
  }

  getBuildingName(id: number): string {
    return this.buildings.find(b => b.id === id)?.name ?? '';
  }

  displayStatus(status: string): string {
    // Reporter UI displays Assigned as In Progress.
    if (status === 'Assigned') {
      return 'In Progress';
    }

    return status;
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedCampus = '';
    this.selectedBuilding = '';
    this.selectedStatus = '';

    this.buildings = [];
    this.applyFilters();
  }

  getCategories(): string[] {
    return [...new Set(this.tickets.map(ticket => ticket.category))];
  }

  getStatuses(): string[] {
    return ['New', 'In Progress', 'Resolved'];
  }
}