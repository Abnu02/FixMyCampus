import { Component, OnInit } from '@angular/core';
import { Ticket, TicketStatus, TechnicianCategory } from '../../models/ticket.model';
import { AdminTicketService } from '../../services/admin-ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  technicianCategories: TechnicianCategory[] = [];
  categories: string[] = [];
  campuses: string[] = [];
  buildings: string[] = [];
  readonly statuses: TicketStatus[] = Object.values(TicketStatus);

  selectedStatus: TicketStatus | 'All' = 'All';
  selectedCategory: string = 'All';
  selectedCampus: string = 'All';
  selectedBuilding: string = 'All';
  searchQuery = '';
  isLoading = false;
  isAssigning = false;
  errorMessage = '';

  // Detail Modal State
  selectedTicket: Ticket | null = null;
  isDetailModalOpen = false;

  // Assignment Cascading Form State
  assignTechnicianType = '';
  assignTechnicianName = '';
  availableTechnicians: string[] = [];

  constructor(private adminTicketService: AdminTicketService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminTicketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.categories = this.getUniqueValues(data.map(ticket => ticket.category));
        this.campuses = this.getUniqueValues(data.map(ticket => ticket.campusName));
        this.buildings = this.getUniqueValues(data.map(ticket => ticket.buildingName));
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Tickets could not be loaded. Please try again.';
        this.isLoading = false;
      }
    });

    this.adminTicketService.getTechnicianCategories().subscribe({
      next: (categories) => {
        this.technicianCategories = categories;
      },
      error: () => {
        this.errorMessage = 'Technician options could not be loaded.';
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(t => {
      const matchStatus = this.selectedStatus === 'All' || t.status === this.selectedStatus;
      const matchCategory = this.selectedCategory === 'All' || t.category === this.selectedCategory;
      const matchCampus = this.selectedCampus === 'All' || t.campusName === this.selectedCampus;
      const matchBuilding = this.selectedBuilding === 'All' || t.buildingName === this.selectedBuilding;
      const query = this.searchQuery.trim().toLocaleLowerCase();
      const matchSearch = !query || [
        t.id.toString(),
        t.category,
        t.campusName,
        t.buildingName,
        t.room,
        t.description,
        t.technicianName ?? ''
      ].some(value => value.toLocaleLowerCase().includes(query));
      return matchStatus && matchCategory && matchCampus && matchBuilding && matchSearch;
    });
  }

  onParentStatusChange(status: TicketStatus | 'All'): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  openTicketDetails(ticket: Ticket): void {
    this.errorMessage = '';
    this.adminTicketService.getTicketById(ticket.id).subscribe({
      next: (detail) => {
        this.selectedTicket = detail ?? ticket;
        this.assignTechnicianType = this.selectedTicket.technicianType ?? '';
        this.assignTechnicianName = this.selectedTicket.technicianName ?? '';
        this.updateAvailableTechnicians(false);
        this.isDetailModalOpen = true;
      },
      error: () => {
        this.errorMessage = 'Ticket details could not be loaded. Please try again.';
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedTicket = null;
    this.assignTechnicianType = '';
    this.assignTechnicianName = '';
    this.availableTechnicians = [];
  }

  onTechnicianTypeChange(): void {
    this.updateAvailableTechnicians(true);
  }

  private updateAvailableTechnicians(clearSelection: boolean): void {
    const found = this.technicianCategories.find(category => category.type === this.assignTechnicianType);
    this.availableTechnicians = found?.technicians ?? [];
    if (clearSelection || !this.availableTechnicians.includes(this.assignTechnicianName)) {
      this.assignTechnicianName = '';
    }
  }

  private getUniqueValues(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }

  getStatusLabel(status: string): string {
    return status === TicketStatus.InProgress ? 'In Progress' : status;
  }

  trackTicketById(_index: number, ticket: Ticket): number {
    return ticket.id;
  }

  trackTechnicianCategory(_index: number, category: TechnicianCategory): string {
    return category.type;
  }

  trackByValue(_index: number, value: string): string {
    return value;
  }

  submitAssignment(): void {
    if (!this.selectedTicket || !this.assignTechnicianType || !this.assignTechnicianName || this.isAssigning) {
      return;
    }

    this.isAssigning = true;
    this.errorMessage = '';
    this.adminTicketService
      .assignTechnician(this.selectedTicket.id, this.assignTechnicianType, this.assignTechnicianName)
      .subscribe({
        next: (updated) => {
          this.selectedTicket = updated;
          this.isAssigning = false;
          this.closeDetailModal();
          this.loadData();
        },
        error: () => {
          this.errorMessage = 'Technician assignment failed. Please try again.';
          this.isAssigning = false;
        }
      });
  }

  getStatusBadgeClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.New: return 'badge-new';
      case TicketStatus.Assigned: return 'badge-assigned';
      case TicketStatus.InProgress: return 'badge-progress';
      case TicketStatus.Resolved: return 'badge-resolved';
      default: return '';
    }
  }

  getStatusDotClass(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.New: return 'dot-new';
      case TicketStatus.Assigned: return 'dot-assigned';
      case TicketStatus.InProgress: return 'dot-progress';
      case TicketStatus.Resolved: return 'dot-resolved';
      default: return '';
    }
  }
}