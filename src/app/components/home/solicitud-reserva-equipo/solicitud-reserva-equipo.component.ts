import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DetallePrestamoEquipo, ModalDevolucion, ModalStateService } from '../../elements/modales-globales/modal-state.service';

export type EstadoEquipo = 'pendiente' | 'activo' | 'extension' | 'atrasado' | 'devuelto';

export interface PrestamoEquipo {
  id: string;
  titulo: string;
  imagen: string;
  codigos: string;
  estudiante: string;
  estudianteId: string;
  fechaInfo: string;
  cantidad: string;
  motivo: string;
  estado: EstadoEquipo;
  accionTexto?: string;
  extensionInfo?: string;
  diasAtraso?: number;
}

@Component({
  selector: 'app-admin-equipos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-reserva-equipo.component.html',
  styleUrls: ['./solicitud-reserva-equipo.component.css']
})
export class SolicitudReservaEquipoComponent {

  private modalSvc = inject(ModalStateService);

  filtroEstado = signal<string>('todos');
  busqueda     = signal<string>('');
  tabActivo    = signal<'espacios' | 'equipos'>('equipos');

  prestamos = signal<PrestamoEquipo[]>([
    {
      id: 'PREST-2026-001',
      titulo: 'iPad Pro 12.9" (2024)',
      imagen: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=200&h=200&fit=crop',
      codigos: 'IPAD-001 a IPAD-004',
      estudiante: 'Laura Pérez',
      estudianteId: '2024-0289',
      fechaInfo: 'Devolución solicitada: 10 Feb 2026',
      cantidad: '4 unidades',
      motivo: 'Presentación de proyecto final de diseño interactivo, requiere 4 dispositivos para demo en vivo.',
      estado: 'pendiente'
    },
    {
      id: 'PREST-2026-002',
      titulo: 'Laptop Dell XPS 15',
      imagen: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
      codigos: 'LAP-001, LAP-002',
      estudiante: 'María González',
      estudianteId: '2024-0156',
      fechaInfo: 'Prestado: 25 Ene 2026 · Vence hoy',
      cantidad: '2 unidades',
      motivo: 'Desarrollo continuo de tesis.',
      estado: 'extension',
      extensionInfo: 'El estudiante solicita una extensión de +5 días (nueva fecha: 4 Feb 2026). Motivo: desarrollo continuo de tesis.'
    },
    {
      id: 'PREST-2026-003',
      titulo: 'Monitor LG UltraWide 34"',
      imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      codigos: 'MON-015 a MON-017',
      estudiante: 'Roberto Silva',
      estudianteId: '2024-0234',
      fechaInfo: 'Prestado: 22 Ene · Vence: 5 Feb 2026',
      cantidad: '3 unidades',
      motivo: 'Préstamo activo — en uso para proyecto de diseño UX. Devolución en 6 días.',
      estado: 'activo'
    },
    {
      id: 'PREST-2026-004',
      titulo: 'Cámara Canon EOS R5',
      imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
      codigos: 'CAM-003',
      estudiante: 'Ana Martínez',
      estudianteId: '2024-0178',
      fechaInfo: 'Venció: 27 Ene 2026 · 3 días de atraso',
      cantidad: '1 unidad',
      motivo: 'Préstamo vencido. El estudiante no ha realizado la devolución ni ha solicitado extensión.',
      estado: 'atrasado',
      diasAtraso: 3
    },
    {
      id: 'PREST-2026-005',
      titulo: 'Proyector Epson EB-2250U',
      imagen: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=200&h=200&fit=crop',
      codigos: 'PROJ-007',
      estudiante: 'Carlos Ramírez',
      estudianteId: '2024-0201',
      fechaInfo: 'Devuelto el 28 Ene 2026 · 2 días antes',
      cantidad: '1 unidad',
      motivo: 'Equipo devuelto en excelente estado. Sin observaciones.',
      estado: 'devuelto',
      accionTexto: 'Devuelto el 28 Ene 2026'
    }
  ]);

  prestamosFiltrados = computed(() => {
    const t = this.busqueda().toLowerCase();
    return this.prestamos().filter(p => {
      const estado   = this.filtroEstado() === 'todos' || p.estado === this.filtroEstado();
      const busqueda = !t || p.titulo.toLowerCase().includes(t)
                          || p.estudiante.toLowerCase().includes(t)
                          || p.id.toLowerCase().includes(t);
      return estado && busqueda;
    });
  });

  statTotal     = computed(() => this.prestamos().length);
  statPendiente = computed(() => this.prestamos().filter(p => p.estado === 'pendiente' || p.estado === 'extension').length);
  statAtrasado  = computed(() => this.prestamos().filter(p => p.estado === 'atrasado').length);
  statDevuelto  = computed(() => this.prestamos().filter(p => p.estado === 'devuelto').length);

  // ── Acciones ──────────────────────────────
  aprobar(id: string): void {
    this.prestamos.update(list =>
      list.map(p => p.id === id
        ? { ...p, estado: 'activo' as const, accionTexto: 'Aprobado ahora' }
        : p)
    );
  }

  aprobarExtension(id: string): void {
    this.prestamos.update(list =>
      list.map(p => p.id === id
        ? { ...p, estado: 'activo' as const, accionTexto: 'Extensión aprobada · +5 días', extensionInfo: undefined }
        : p)
    );
  }

  rechazar(id: string): void {
    this.modalSvc.abrirRechazoPrestamo(id, (motivo) => {
      const resumen = motivo.length > 40 ? motivo.substring(0, 40) + '…' : motivo;
      this.prestamos.update(list =>
        list.map(p => p.id === id
          ? { ...p, estado: 'devuelto' as const, accionTexto: `Rechazado · ${resumen}` }
          : p)
      );
    });
  }

  marcarDevuelto(p: PrestamoEquipo): void {
    const data: ModalDevolucion = {
      id: p.id,
      equipo: p.titulo,
      estudiante: p.estudiante
    };
    this.modalSvc.abrirDevolucion(data, () => {
      this.prestamos.update(list =>
        list.map(x => x.id === p.id
          ? { ...x, estado: 'devuelto' as const, accionTexto: 'Devuelto ahora' }
          : x)
      );
    });
  }

  enviarRecordatorio(id: string): void {
    this.prestamos.update(list =>
      list.map(p => p.id === id
        ? { ...p, accionTexto: '✓ Recordatorio enviado' }
        : p)
    );
  }

  abrirDetalle(p: PrestamoEquipo): void {
    const data: DetallePrestamoEquipo = {
      id:              p.id,
      equipo:          p.titulo,
      estudiante:      p.estudiante,
      estudianteId:    p.estudianteId,
      codigos:         p.codigos,
      cantidad:        p.cantidad,
      fechaPrestamo:   p.fechaInfo,
      fechaDevolucion: p.fechaInfo,
      estado:          p.estado,
      motivo:          p.motivo,
      diasAtraso:      p.diasAtraso,
      extensionSolicitada: p.extensionInfo
    };
    this.modalSvc.abrirDetallePrestamo(data);
  }
}
