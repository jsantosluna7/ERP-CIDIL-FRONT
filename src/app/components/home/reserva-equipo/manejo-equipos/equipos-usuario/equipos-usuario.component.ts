import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Loan {
  id: number;
  equipmentName: string;
  equipmentImage: string;
  equipmentCode: string;
  quantity: number;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'pending' | 'returned' | 'overdue';
  progress: number;
  daysRemaining: number;
  studentName: string;
  studentId: string;
  approvedBy?: string;
  adminNotes?: string;
}

interface ExtensionRequest {
  loanId: number;
  newDueDate: Date;
  reason: string;
}

@Component({
  selector: 'app-equipos-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './equipos-usuario.component.html',
  styleUrl: './equipos-usuario.component.css',
})
export class EquiposUsuarioComponent {
  studentName: string = 'María González';
  studentId: string = '2024-0156';
  studentInitials: string = 'MG';

  activeTab: 'active' | 'pending' | 'history' = 'active';

  // Statistics
  equipmentInUse: number = 7;
  pendingApproval: number = 1;
  returnedOnTime: number = 8;
  totalReturned: number = 8;

  constructor(private router: Router) {}

  // Loans data
  activeLoans: Loan[] = [
    {
      id: 1,
      equipmentName: 'Laptop Dell XPS 15',
      equipmentImage:
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop',
      equipmentCode: 'LAP-001, LAP-002',
      quantity: 2,
      loanDate: new Date('2026-01-25T10:30:00'),
      dueDate: new Date('2026-01-30T23:59:59'),
      status: 'active',
      progress: 100,
      daysRemaining: 0,
      studentName: 'María González',
      studentId: '2024-0156',
      approvedBy: 'Admin - Juan Pérez',
      adminNotes:
        'Equipos verificados y en perfecto estado. Responsabilidad del estudiante mantenerlos en buen estado.',
    },
    {
      id: 2,
      equipmentName: 'Monitor LG UltraWide 34"',
      equipmentImage:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
      equipmentCode: 'MON-015 a MON-017',
      quantity: 3,
      loanDate: new Date('2026-01-22T15:45:00'),
      dueDate: new Date('2026-02-05T23:59:59'),
      status: 'active',
      progress: 57,
      daysRemaining: 6,
      studentName: 'María González',
      studentId: '2024-0156',
    },
  ];

  pendingLoans: Loan[] = [
    {
      id: 3,
      equipmentName: 'iPad Pro 12.9" (2024)',
      equipmentImage:
        'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600&h=400&fit=crop',
      equipmentCode: 'IPAD-001 a IPAD-004',
      quantity: 4,
      loanDate: new Date('2026-01-30T09:15:00'),
      dueDate: new Date('2026-02-10T23:59:59'),
      status: 'pending',
      progress: 0,
      daysRemaining: 0,
      studentName: 'María González',
      studentId: '2024-0156',
    },
  ];

  historyLoans: Loan[] = [];

  // Modal states
  showExtensionModal: boolean = false;
  showDetailsModal: boolean = false;
  selectedLoan: Loan | null = null;

  // Extension form
  extensionRequest: ExtensionRequest = {
    loanId: 0,
    newDueDate: new Date(),
    reason: '',
  };

  minExtensionDate: string = '';
  maxExtensionDate: string = '';

  ngOnInit(): void {
    this.calculateLoanMetrics();
  }

  rutaInventario() {
    this.router.navigate(['/home/inventario']);
  }

  calculateLoanMetrics(): void {
    const today = new Date();

    this.activeLoans.forEach((loan) => {
      const dueDate = new Date(loan.dueDate);
      const loanDate = new Date(loan.loanDate);
      const totalDays = Math.ceil(
        (dueDate.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const daysElapsed = Math.ceil(
        (today.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      loan.progress = Math.min(
        100,
        Math.round((daysElapsed / totalDays) * 100),
      );
      loan.daysRemaining = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (loan.daysRemaining < 0) {
        loan.status = 'overdue';
      }
    });
  }

  showTab(tab: 'active' | 'pending' | 'history'): void {
    this.activeTab = tab;
  }

  openExtensionModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.showExtensionModal = true;

    // Set date limits
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minExtensionDate = this.formatDateForInput(tomorrow);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    this.maxExtensionDate = this.formatDateForInput(maxDate);

    // Reset form
    this.extensionRequest = {
      loanId: loan.id,
      newDueDate: tomorrow,
      reason: '',
    };
  }

  openDetailsModal(loan: Loan): void {
    this.selectedLoan = loan;
    this.showDetailsModal = true;
  }

  closeModal(): void {
    this.showExtensionModal = false;
    this.showDetailsModal = false;
    this.selectedLoan = null;
  }

  submitExtension(): void {
    if (!this.extensionRequest.newDueDate || !this.extensionRequest.reason) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Here you would call your service to submit the extension request
    console.log('Extension request:', this.extensionRequest);
    alert(
      'Solicitud de extensión enviada. Recibirás una notificación cuando sea revisada.',
    );
    this.closeModal();
  }

  cancelRequest(requestId: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      // Here you would call your service to cancel the request
      console.log('Canceling request:', requestId);
      alert('Solicitud cancelada');
      this.pendingLoans = this.pendingLoans.filter(
        (loan) => loan.id !== requestId,
      );
      this.pendingApproval--;
    }
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getDueDateClass(loan: Loan): string {
    if (loan.daysRemaining < 0) return 'danger';
    if (loan.daysRemaining === 0) return 'warning';
    return '';
  }

  getProgressClass(loan: Loan): string {
    if (loan.daysRemaining < 0) return 'danger';
    if (loan.daysRemaining <= 1) return 'warning';
    return '';
  }

  getDaysRemainingText(loan: Loan): string {
    if (loan.daysRemaining < 0) {
      return `${Math.abs(loan.daysRemaining)} días de atraso`;
    } else if (loan.daysRemaining === 0) {
      return 'Vence hoy';
    } else if (loan.daysRemaining === 1) {
      return 'Vence mañana';
    } else {
      return `Vence en ${loan.daysRemaining} días`;
    }
  }
}
