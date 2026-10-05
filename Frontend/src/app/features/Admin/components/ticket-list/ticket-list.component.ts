import { Component, OnInit } from '@angular/core';
import { Ticket, TicketStatus } from '../../models/ticket.model';
import { AdminTicketService } from '../../services/admin-ticket.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-ticket-list',
  standalone: false,
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  categories: string[] = [];
  buildings: string[] = [];
  readonly statuses: TicketStatus[] = Object.values(TicketStatus) as TicketStatus[];

  selectedStatus: TicketStatus | 'All' = 'All';
  selectedCategory: string = 'All';
  selectedBuilding: string = 'All';
  searchQuery = '';
  isLoading = false;
  isAssigning = false;
  errorMessage = '';
  debugInfo = '';

  // Detail Modal State
  selectedTicket: Ticket | null = null;
  isDetailModalOpen = false;

  // Assignment Form State — uses technicianId (int) to match backend
  assignTechnicianId: number | null = null;

  constructor(private adminTicketService: AdminTicketService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const token = this.authService.getToken();
    this.debugInfo = `Token: ${token ? token.substring(0, 20) + '...' : 'MISSING'} | User: ${this.authService.currentUser()?.email || 'none'} | Role: ${this.authService.currentUser()?.role || 'none'}`;
    console.log('[TicketListComponent] Requesting tickets. Debug:', this.debugInfo);
    this.adminTicketService.getTickets().subscribe({
      next: (data) => {
        console.log('[TicketListComponent] Received data:', data);
        try {
          this.tickets = Array.isArray(data) ? data : [];
          this.categories = this.getUniqueValues(this.tickets.map(ticket => ticket?.category || ''));
          this.buildings = this.getUniqueValues(this.tickets.map(ticket => ticket?.buildingName || ''));
          this.applyFilters();
          this.debugInfo = `Loaded ${this.tickets.length} tickets OK`;
        } catch (e) {
          console.error('[TicketListComponent] Error processing tickets data:', e);
        } finally {
          this.isLoading = false;
        }
      },
      error: (err) => {
        const status = err?.status;
        const msg = err?.error?.message || err?.message || 'Unknown error';
        this.debugInfo = `HTTP Error ${status}: ${msg}`;
        console.error('[TicketListComponent] Error loading tickets:', err);
        this.errorMessage = `Error ${status}: ${msg}`;
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(t => {
      const matchStatus = this.selectedStatus === 'All' || t.status === this.selectedStatus;
      const matchCategory = this.selectedCategory === 'All' || t.category === this.selectedCategory;
      const matchBuilding = this.selectedBuilding === 'All' || t.buildingName === this.selectedBuilding;
      const query = this.searchQuery.trim().toLocaleLowerCase();
      const matchSearch = !query || [
        t.id.toString(),
        t.category,
        t.buildingName,
        t.room,
        t.description
      ].some(value => value.toLocaleLowerCase().includes(query));
      return matchStatus && matchCategory && matchBuilding && matchSearch;
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
        this.assignTechnicianId = this.selectedTicket.technicianID ?? null;
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
    this.assignTechnicianId = null;
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

  trackByValue(_index: number, value: string): string {
    return value;
  }

  submitAssignment(): void {
    if (!this.selectedTicket || !this.assignTechnicianId || this.isAssigning) {
      return;
    }

    this.isAssigning = true;
    this.errorMessage = '';
    this.adminTicketService
      .assignTechnician(this.selectedTicket.id, this.assignTechnicianId)
      .subscribe({
        next: () => {
          this.isAssigning = false;
          this.closeDetailModal();
          this.loadData();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Technician assignment failed. Please try again.';
          this.isAssigning = false;
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case TicketStatus.New: return 'badge-new';
      case TicketStatus.Assigned: return 'badge-assigned';
      case TicketStatus.InProgress: return 'badge-progress';
      case TicketStatus.Resolved: return 'badge-resolved';
      default: return '';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case TicketStatus.New: return 'dot-new';
      case TicketStatus.Assigned: return 'dot-assigned';
      case TicketStatus.InProgress: return 'dot-progress';
      case TicketStatus.Resolved: return 'dot-resolved';
      default: return '';
    }
  }
}