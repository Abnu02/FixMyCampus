import { Component, OnInit } from '@angular/core';
import { AdminTicketService } from '../../services/admin-ticket.service';
import { ResolvedTicket, Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-history',
  standalone: false,
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.css']
})
export class TicketHistoryComponent implements OnInit {
  resolvedTickets: ResolvedTicket[] = [];
  filteredHistory: ResolvedTicket[] = [];

  searchTerm = '';
  selectedCategory = 'All';
  categories: string[] = [];
  isLoading = false;
  errorMessage = '';
  detailErrorMessage = '';

  // Detail Modal State
  selectedTicket: Ticket | null = null;
  isModalOpen = false;

  constructor(private ticketService: AdminTicketService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('[TicketHistoryComponent] Requesting resolved tickets...');
    this.ticketService.getResolvedTickets().subscribe({
      next: (tickets) => {
        console.log('[TicketHistoryComponent] Received resolved tickets:', tickets);
        try {
          this.resolvedTickets = Array.isArray(tickets) ? tickets : [];
          this.categories = this.getUniqueValues(this.resolvedTickets.map(ticket => ticket?.category || ''));
          this.applyFilters();
        } catch (e) {
          console.error('[TicketHistoryComponent] Error processing resolved tickets:', e);
        } finally {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('[TicketHistoryComponent] Error loading history:', err);
        this.errorMessage = err?.error?.message || 'Resolved tickets could not be loaded. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    this.filteredHistory = this.resolvedTickets.filter(t => {
      const matchSearch = !query || [
        t.id.toString(),
        t.category,
        t.buildingName,
        t.room,
        t.description
      ].some(value => value.toLocaleLowerCase().includes(query));

      const matchCategory = this.selectedCategory === 'All' || t.category === this.selectedCategory;

      return matchSearch && matchCategory;
    });
  }

  getUniqueValues(values: string[]): string[] {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }

  viewDetails(ticket: ResolvedTicket): void {
    this.detailErrorMessage = '';
    this.ticketService.getTicketById(ticket.id).subscribe({
      next: (detail) => {
        this.selectedTicket = detail ?? ticket;
        this.isModalOpen = true;
      },
      error: () => {
        this.detailErrorMessage = 'Full ticket history could not be loaded. Please try again.';
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTicket = null;
    this.detailErrorMessage = '';
  }

  trackByTicketId(_index: number, ticket: ResolvedTicket): number {
    return ticket.id;
  }

  trackByValue(_index: number, value: string): string {
    return value;
  }
}