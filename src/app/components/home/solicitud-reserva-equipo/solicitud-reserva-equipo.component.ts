import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Loan {
  id: number;
  equipmentName: string;
  equipmentImage: string;
  equipmentCode: string;
  quantity: number;
  studentName: string;
  studentId: string;
  studentInitials: string;
  loanDate?: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'pending' | 'returned' | 'overdue' | 'extension';
  requestDate?: Date;
  extensionDays?: number;
  extensionReason?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  returnComments?: string;
  adminNotes?: string;
}

@Component({
  selector: 'app-solicitud-reserva-equipo',
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-reserva-equipo.component.html',
  styleUrl: './solicitud-reserva-equipo.component.css',
})
export class SolicitudReservaEquipoComponent {
  activeTab: 'all' | 'pending' | 'active' | 'overdue' | 'extensions' = 'all';
  searchTerm: string = '';
  statusFilter: string = 'all';
  dateFilter: string = 'all';

  // Statistics
  activeLoansCount: number = 12;
  equipmentLoanedCount: number = 47;
  totalEquipmentCount: number = 120;
  pendingApprovalsCount: number = 5;
  overdueLoansCount: number = 2;

  // Loans data
  allLoans: Loan[] = [
    {
      id: 1,
      equipmentName: 'iPad Pro 12.9" (2024)',
      equipmentImage:
        'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=120&h=120&fit=crop',
      equipmentCode: 'IPAD-001 a IPAD-004',
      quantity: 4,
      studentName: 'Laura Pérez',
      studentId: '2024-0289',
      studentInitials: 'LP',
      requestDate: new Date('2026-01-30T09:15:00'),
      dueDate: new Date('2026-02-10T23:59:59'),
      status: 'pending',
    },
    {
      id: 2,
      equipmentName: 'Laptop Dell XPS 15',
      equipmentImage:
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=120&h=120&fit=crop',
      equipmentCode: 'LAP-001, LAP-002',
      quantity: 2,
      studentName: 'María González',
      studentId: '2024-0156',
      studentInitials: 'MG',
      loanDate: new Date('2026-01-25T10:30:00'),
      dueDate: new Date('2026-01-30T23:59:59'),
      status: 'extension',
      extensionDays: 5,
      extensionReason:
        'Necesito más tiempo para completar el proyecto final de la materia',
    },
    {
      id: 3,
      equipmentName: 'Monitor LG UltraWide 34"',
      equipmentImage:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=120&h=120&fit=crop',
      equipmentCode: 'MON-015 a MON-017',
      quantity: 3,
      studentName: 'Roberto Silva',
      studentId: '2024-0234',
      studentInitials: 'RS',
      loanDate: new Date('2026-01-22T15:45:00'),
      dueDate: new Date('2026-02-05T23:59:59'),
      status: 'active',
    },
    {
      id: 4,
      equipmentName: 'Cámara Canon EOS R5',
      equipmentImage:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=120&h=120&fit=crop',
      equipmentCode: 'CAM-003',
      quantity: 1,
      studentName: 'Ana Martínez',
      studentId: '2024-0178',
      studentInitials: 'AM',
      loanDate: new Date('2026-01-15T09:00:00'),
      dueDate: new Date('2026-01-27T23:59:59'),
      status: 'overdue',
    },
    {
      id: 5,
      equipmentName: 'Proyector Epson EB-2250U',
      equipmentImage:
        'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=120&h=120&fit=crop',
      equipmentCode: 'PROJ-007',
      quantity: 1,
      studentName: 'Carlos Ramírez',
      studentId: '2024-0201',
      studentInitials: 'CR',
      loanDate: new Date('2026-01-20T14:00:00'),
      dueDate: new Date('2026-01-30T23:59:59'),
      returnDate: new Date('2026-01-28T11:15:00'),
      status: 'returned',
      condition: 'excellent',
      returnComments:
        'Equipo devuelto en excelente estado. Sin daños visibles.',
    },
  ];

  filteredLoans: Loan[] = [];

  // Modal states
  showDetailsModal: boolean = false;
  showReturnModal: boolean = false;
  showApprovalModal: boolean = false;
  selectedLoan: Loan | null = null;

  // Forms
  returnDate: string = '';
  equipmentCondition: string = 'excellent';
  returnComments: string = '';
  approvalComments: string = '';
  approvalType: 'approve' | 'reject' = 'approve';
  approvalAction: 'loan' | 'extension' = 'loan';

  ngOnInit(): void {
    this.setCurrentDateTime();
    this.filterLoans();
  }

  setCurrentDateTime(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.returnDate = now.toISOString().slice(0, 16);
  }

  showTab(tab: 'all' | 'pending' | 'active' | 'overdue' | 'extensions'): void {
    this.activeTab = tab;
    this.filterLoans();
  }

  filterLoans(): void {
    let filtered = [...this.allLoans];

    // Filter by tab
    if (this.activeTab !== 'all') {
      filtered = filtered.filter((loan) => loan.status === this.activeTab);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.equipmentName.toLowerCase().includes(term) ||
          loan.studentName.toLowerCase().includes(term) ||
          loan.studentId.includes(term) ||
          loan.equipmentCode.toLowerCase().includes(term),
      );
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((loan) => loan.status === this.statusFilter);
    }

    this.filteredLoans = filtered;
  }

  onSearchChange(): void {
    this.filterLoans();
  }

  onStatusFilterChange(): void {
    this.filterLoans();
  }

  viewDetails(loan: Loan): void {
    this.selectedLoan = loan;
    this.showDetailsModal = true;
  }

  markReturned(loan: Loan): void {
    this.selectedLoan = loan;
    this.showReturnModal = true;
    this.setCurrentDateTime();
    this.equipmentCondition = 'excellent';
    this.returnComments = '';
  }

  confirmReturn(): void {
    if (this.selectedLoan) {
      // Here you would call your service to mark as returned
      console.log('Marking as returned:', {
        loanId: this.selectedLoan.id,
        returnDate: this.returnDate,
        condition: this.equipmentCondition,
        comments: this.returnComments,
      });
      alert('Equipo marcado como devuelto');
      this.closeModal();
    }
  }

  approveRequest(loan: Loan): void {
    this.selectedLoan = loan;
    this.approvalType = 'approve';
    this.approvalAction = 'loan';
    this.approvalComments = '';
    this.showApprovalModal = true;
  }

  rejectRequest(loan: Loan): void {
    this.selectedLoan = loan;
    this.approvalType = 'reject';
    this.approvalAction = 'loan';
    this.approvalComments = '';
    this.showApprovalModal = true;
  }

  approveExtension(loan: Loan): void {
    this.selectedLoan = loan;
    this.approvalType = 'approve';
    this.approvalAction = 'extension';
    this.approvalComments = '';
    this.showApprovalModal = true;
  }

  rejectExtension(loan: Loan): void {
    this.selectedLoan = loan;
    this.approvalType = 'reject';
    this.approvalAction = 'extension';
    this.approvalComments = '';
    this.showApprovalModal = true;
  }

  confirmApproval(): void {
    if (this.selectedLoan) {
      // Here you would call your service
      console.log('Approval action:', {
        loanId: this.selectedLoan.id,
        type: this.approvalType,
        action: this.approvalAction,
        comments: this.approvalComments,
      });
      alert('Acción confirmada');
      this.closeModal();
    }
  }

  extendDueDate(loan: Loan): void {
    const newDate = prompt('Nueva fecha de devolución (YYYY-MM-DD):');
    if (newDate) {
      // Here you would call your service
      console.log('Extending due date:', { loanId: loan.id, newDate });
      alert('Fecha extendida exitosamente');
    }
  }

  sendReminder(loan: Loan): void {
    if (confirm('¿Enviar recordatorio al estudiante?')) {
      // Here you would call your service
      console.log('Sending reminder to:', loan.studentId);
      alert('Recordatorio enviado');
    }
  }

  exportData(): void {
    // Here you would implement export functionality
    alert('Exportando datos...');
  }

  closeModal(): void {
    this.showDetailsModal = false;
    this.showReturnModal = false;
    this.showApprovalModal = false;
    this.selectedLoan = null;
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

  getDaysRemaining(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDueDateText(loan: Loan): string {
    if (loan.status === 'returned' && loan.returnDate) {
      const days = this.getDaysRemaining(loan.dueDate);
      if (days > 0) {
        return `${days} días antes`;
      } else {
        return 'A tiempo';
      }
    }

    const days = this.getDaysRemaining(loan.dueDate);
    if (days < 0) {
      return `${Math.abs(days)} días de atraso`;
    } else if (days === 0) {
      return 'Vence hoy';
    } else {
      return `En ${days} días`;
    }
  }

  getApprovalTitle(): string {
    if (this.approvalAction === 'extension') {
      return this.approvalType === 'approve'
        ? 'Aprobar Extensión de Plazo'
        : 'Rechazar Extensión de Plazo';
    }
    return this.approvalType === 'approve'
      ? 'Aprobar Solicitud de Préstamo'
      : 'Rechazar Solicitud de Préstamo';
  }

  getApprovalSubtitle(): string {
    if (!this.selectedLoan) return '';
    if (this.approvalAction === 'extension') {
      return `${this.selectedLoan.equipmentName} - ${this.selectedLoan.studentName} (+${this.selectedLoan.extensionDays} días)`;
    }
    return `${this.selectedLoan.equipmentName} - ${this.selectedLoan.studentName}`;
  }

  getTabCount(tab: string): number {
    switch (tab) {
      case 'all':
        return this.allLoans.length;
      case 'pending':
        return this.allLoans.filter((l) => l.status === 'pending').length;
      case 'active':
        return this.allLoans.filter((l) => l.status === 'active').length;
      case 'overdue':
        return this.allLoans.filter((l) => l.status === 'overdue').length;
      case 'extensions':
        return this.allLoans.filter((l) => l.status === 'extension').length;
      default:
        return 0;
    }
  }
}
