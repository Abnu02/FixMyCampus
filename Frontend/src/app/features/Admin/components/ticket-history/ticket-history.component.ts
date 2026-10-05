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
    this.ticketService.getResolvedTickets().subscribe({
      next: (tickets) => {
        this.resolvedTickets = tickets;
        this.categories = this.getUniqueValues(tickets.map(ticket => ticket.category));
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Resolved tickets could not be loaded. Please try again.';
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