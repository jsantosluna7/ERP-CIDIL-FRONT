import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DetallePrestamoUsuario, ModalExtension, ModalStateService } from '../../../../elements/modales-globales/modal-state.service';
import { Router } from '@angular/router';

export type EstadoPrestamo = 'activo' | 'pendiente' | 'atrasado' | 'devuelto' | 'extension';

export interface PrestamoUsuario {
  id: string;
  titulo: string;
  imagen: string;
  codigos: string;
  fechaInfo: string;
  fechaVence: string;
  fechaVenceColor?: 'yellow' | 'red' | 'green';
  cantidad: string;
  estado: EstadoPrestamo;
  mensajeEstado: string;
  enviadaEl: string;
  progreso?: { actual: number; total: number; tipo: 'normal' | 'warning' | 'danger' };
  // Para modal detalle
  fechaInicio: string;
  fechaFin: string;
  aprobadoPor: string;
  diasAtraso?: number;
}

@Component({
  selector: 'app-mis-prestamos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipos-usuario.component.html',
  styleUrls: ['./equipos-usuario.component.css']
})
export class EquiposUsuarioComponent {

  private modalSvc = inject(ModalStateService);

  filtroActivo = signal<string>('todos');
  tabActivo    = signal<'espacios' | 'equipos'>('equipos');

  prestamos = signal<PrestamoUsuario[]>([
    {
      id: 'PREST-2026-002',
      titulo: 'Laptop Dell XPS 15',
      imagen: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
      codigos: 'LAP-001, LAP-002',
      fechaInfo: 'Prestado: 25 Ene 2026 · 10:30 AM',
      fechaVence: 'Vence hoy · 30 Ene 2026',
      fechaVenceColor: 'yellow',
      cantidad: '2 unidades',
      estado: 'activo',
      mensajeEstado: 'Tu préstamo vence hoy a las 11:59 PM. Si necesitas más tiempo, solicita una extensión antes de que expire.',
      enviadaEl: 'Activo desde hace 5 días',
      progreso: { actual: 5, total: 5, tipo: 'warning' },
      fechaInicio: '25 Ene 2026, 10:30 AM',
      fechaFin: '30 Ene 2026, 11:59 PM',
      aprobadoPor: 'Admin — Juan Pérez'
    },
    {
      id: 'PREST-2026-001',
      titulo: 'iPad Pro 12.9" (2024)',
      imagen: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=200&h=200&fit=crop',
      codigos: 'IPAD-001 a IPAD-004',
      fechaInfo: 'Solicitado: 30 Ene 2026 · 9:15 AM',
      fechaVence: 'Devolución solicitada: 10 Feb 2026',
      cantidad: '4 unidades',
      estado: 'pendiente',
      mensajeEstado: 'Tu solicitud está siendo revisada por un administrador. Recibirás una notificación cuando sea aprobada o rechazada.',
      enviadaEl: 'Enviada hace 2 horas',
      fechaInicio: '30 Ene 2026, 9:15 AM',
      fechaFin: '10 Feb 2026, 11:59 PM',
      aprobadoPor: 'Pendiente de aprobación'
    },
    {
      id: 'PREST-2026-003',
      titulo: 'Monitor LG UltraWide 34"',
      imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      codigos: 'MON-015 a MON-017',
      fechaInfo: 'Prestado: 22 Ene 2026 · 3:45 PM',
      fechaVence: 'Venció: 27 Ene 2026 · 3 días de atraso',
      fechaVenceColor: 'red',
      cantidad: '3 unidades',
      estado: 'atrasado',
      mensajeEstado: 'Tu préstamo lleva 3 días de atraso. Por favor devuelve los equipos a la brevedad para evitar restricciones en futuros préstamos.',
      enviadaEl: 'Activo desde hace 17 días',
      progreso: { actual: 17, total: 14, tipo: 'danger' },
      diasAtraso: 3,
      fechaInicio: '22 Ene 2026, 3:45 PM',
      fechaFin: '27 Ene 2026, 11:59 PM (VENCIDO)',
      aprobadoPor: 'Admin — Juan Pérez'
    },
    {
      id: 'PREST-2026-005',
      titulo: 'Proyector Epson EB-2250U',
      imagen: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200&h=200&fit=crop',
      codigos: 'PROJ-007',
      fechaInfo: 'Prestado: 20 Ene 2026 · 2:00 PM',
      fechaVence: 'Devuelto: 28 Ene 2026 · 2 días antes',
      fechaVenceColor: 'green',
      cantidad: '1 unidad',
      estado: 'devuelto',
      mensajeEstado: 'Equipo devuelto exitosamente el 28 Ene 2026. Sin observaciones. ¡Gracias por devolver a tiempo!',
      enviadaEl: 'Enviada el 20 Ene 2026',
      progreso: { actual: 8, total: 10, tipo: 'normal' },
      fechaInicio: '20 Ene 2026, 2:00 PM',
      fechaFin: '30 Ene 2026, 11:59 PM',
      aprobadoPor: 'Admin — Juan Pérez'
    }
  ]);

  constructor(private router: Router){}

  prestamosFiltrados = computed(() =>
    this.prestamos().filter(p =>
      this.filtroActivo() === 'todos' || p.estado === this.filtroActivo()
    )
  );

  conteo = computed(() => ({
    todos:     this.prestamos().length,
    activo:    this.prestamos().filter(p => p.estado === 'activo').length,
    pendiente: this.prestamos().filter(p => p.estado === 'pendiente').length,
    atrasado:  this.prestamos().filter(p => p.estado === 'atrasado').length,
    devuelto:  this.prestamos().filter(p => p.estado === 'devuelto').length,
  }));

  filtrar(estado: string): void { this.filtroActivo.set(estado); }

  cancelar(id: string): void {
    this.prestamos.update(list => list.filter(p => p.id !== id));
  }

  abrirDetalle(p: PrestamoUsuario): void {
    const data: DetallePrestamoUsuario = {
      id:          p.id,
      equipo:      p.titulo,
      codigos:     p.codigos,
      cantidad:    p.cantidad,
      fechaInicio: p.fechaInicio,
      fechaFin:    p.fechaFin,
      aprobadoPor: p.aprobadoPor,
      estado:      p.estado,
      diasAtraso:  p.diasAtraso,
      progreso:    p.progreso,
    };
    this.modalSvc.abrirDetallePrestamoUsuario(data);
  }

  abrirExtension(p: PrestamoUsuario): void {
    const data: ModalExtension = {
      id:          p.id,
      equipo:      p.titulo,
      fechaActual: p.fechaFin,
    };
    this.modalSvc.abrirExtension(data, (fecha, motivo) => {
      console.log(`Extensión solicitada para ${p.id}: ${fecha} — ${motivo}`);
      this.prestamos.update(list =>
        list.map(x => x.id === p.id
          ? { ...x, estado: 'extension' as const }
          : x)
      );
    });
  }

  irInventario(): void {
    this.router.navigate(['/acceso/home/inventario']);
  }
}