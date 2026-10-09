import { Component, OnInit } from '@angular/core';
import { AdminTechnicianService } from '../../services/admin-technician.service';
import { Technician } from '../../models/technician.model';

@Component({
  selector: 'app-technician-management',
  standalone: false,
  templateUrl: './technician-management.component.html',
  styleUrls: ['./technician-management.component.css']
})
export class TechnicianManagementComponent implements OnInit {
  technicians: Technician[] = [];
  filteredTechnicians: Technician[] = [];

  categories: string[] = [
    'Electrical',
    'Plumbing',
    'IT Infrastructure',
    'Hardware Maintenance',
    'Carpentry'
  ];

  selectedCategory = 'All';
  searchTerm = '';
  statusErrorMessage = '';
  pendingStatusIds = new Set<number>();

  // Modal State
  isModalOpen = false;
  isEditMode = false;
  
  techForm = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    category: ''
  };

  constructor(private techService: AdminTechnicianService) {}

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.techService.getTechnicians().subscribe(data => {
      this.technicians = data;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredTechnicians = this.technicians.filter(t => {
      const matchesCategory = this.selectedCategory === 'All' || t.category === this.selectedCategory;
      const matchesSearch = !this.searchTerm ||
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }

  openModal(tech?: Technician): void {
    if (tech) {
      this.isEditMode = true;
      this.techForm = {
        id: tech.id,
        firstName: tech.firstName,
        lastName: tech.lastName,
        email: tech.email,
        password: '', // Blank unless updating
        category: tech.category
      };
    } else {
      this.isEditMode = false;
      this.techForm = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        category: this.categories[0]
      };
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTechnician(): void {
    if (!this.techForm.firstName || !this.techForm.lastName || !this.techForm.email || !this.techForm.category) {
      return;
    }

    if (this.isEditMode) {
      const updatePayload: Partial<Technician> = {
        firstName: this.techForm.firstName,
        lastName: this.techForm.lastName,
        email: this.techForm.email,
        category: this.techForm.category
      };

      if (this.techForm.password) {
        updatePayload.password = this.techForm.password;
      }

      this.techService.updateTechnician(this.techForm.id, updatePayload).subscribe(() => {
        this.loadTechnicians();
        this.closeModal();
      });
    } else {
      if (!this.techForm.password) return;

      this.techService.createTechnician({
        firstName: this.techForm.firstName,
        lastName: this.techForm.lastName,
        email: this.techForm.email,
        password: this.techForm.password,
        category: this.techForm.category
      }).subscribe(() => {
        this.loadTechnicians();
        this.closeModal();
      });
    }
  }

  toggleStatus(tech: Technician): void {
    if (this.pendingStatusIds.has(tech.id)) return;

    this.statusErrorMessage = '';
    this.pendingStatusIds.add(tech.id);
    this.techService.toggleTechnicianStatus(tech.id).subscribe({
      next: (updatedTechnician) => {
        this.technicians = this.technicians.map(current =>
          current.id === updatedTechnician.id ? updatedTechnician : current
        );
        this.applyFilter();
        this.pendingStatusIds.delete(tech.id);
      },
      error: () => {
        this.statusErrorMessage = 'Technician status could not be updated. Please try again.';
        this.pendingStatusIds.delete(tech.id);
      }
    });
  }
}