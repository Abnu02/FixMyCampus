import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-overview',
  standalone: false,
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent implements OnInit {
  selectedCampus = '1';
  selectedBuilding = 'all';
  selectedStatus = 'all';
  searchQuery = '';

  stats = {
    totalActive: 9,
    needsTechnician: 4,
    underRepair: 5,
    resolved: 3
  };

  ngOnInit(): void {}

  resetFilters() {
    this.selectedCampus = '1';
    this.selectedBuilding = 'all';
    this.selectedStatus = 'all';
    this.searchQuery = '';
  }
}