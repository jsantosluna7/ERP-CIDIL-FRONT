import { Injectable, signal } from '@angular/core';

export interface DetalleSolicitud {
  id: string;
  espacio: string;
  solicitante: string;
  departamento: string;
  fechaHora: string;
  duracion: string;
  personas: number;
  motivo: string;
  aprobadoPor: string;
  idEstado: number;
  nombreEstado: string;
}

export interface DetalleSolicitudUsuario {
  id: string;
  espacio: string;
  fecha: string;
  personas: number;
  ubicacion: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivoRechazo?: string;
  aprobadaEl?: string;
  enviadaEl: string;
  motivo: string;
}

export interface DetallePrestamoEquipo {
  id: string;
  equipo: string;
  estudiante: string;
  estudianteId: string;
  codigos: string;
  cantidad: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'pendiente' | 'activo' | 'extension' | 'atrasado' | 'devuelto';
  motivo: string;
  diasAtraso?: number;
  extensionSolicitada?: string;
}

export interface ModalDevolucion {
  id: string;
  equipo: string;
  estudiante: string;
}

export interface DetallePrestamoUsuario {
  id: string;
  equipo: string;
  codigos: string;
  cantidad: string;
  fechaInicio: string;
  fechaFin: string;
  aprobadoPor: string;
  estado: 'pendiente' | 'activo' | 'atrasado' | 'devuelto' | 'extension';
  diasAtraso?: number;
  progreso?: {
    actual: number;
    total: number;
    tipo: 'normal' | 'warning' | 'danger';
  };
}

export interface ModalExtension {
  id: string;
  equipo: string;
  fechaActual: string;
}

@Injectable({ providedIn: 'root' })
export class ModalStateService {
  // ── Admin espacios: detalle ────────────────
  detalleVisible = signal(false);
  detalleData = signal<DetalleSolicitud | null>(null);

  // ── Admin espacios: rechazo ────────────────
  rechazoVisible = signal(false);
  rechazoId = signal('');
  motivoRechazo = signal('');
  motivoError = signal(false);
  private _onConfirmRechazo: ((motivo: string) => void) | null = null;

  // ── Usuario espacios: detalle ──────────────
  detalleUsuarioVisible = signal(false);
  detalleUsuarioData = signal<DetalleSolicitudUsuario | null>(null);

  // ── Admin equipos: detalle préstamo ────────
  detallePrestamoVisible = signal(false);
  detallePrestamoData = signal<DetallePrestamoEquipo | null>(null);
  notasAdmin = signal('');

  // ── Admin equipos: devolución ──────────────
  devolucionVisible = signal(false);
  devolucionData = signal<ModalDevolucion | null>(null);
  fechaDevolucion = signal('');
  estadoEquipo = signal('excelente');
  notasDevolucion = signal('');
  private _onConfirmDevolucion: (() => void) | null = null;

  // ── Admin equipos: rechazo préstamo ───────
  rechazoPrestamoVisible = signal(false);
  rechazoPrestamoId = signal('');
  motivoRechazoPrestamo = signal('');
  motivoErrorPrestamo = signal(false);
  private _onConfirmRechazoPrestamo: ((motivo: string) => void) | null = null;

  // ── Usuario equipos: detalle préstamo ─────
  detallePrestamoUsuarioVisible = signal(false);
  detallePrestamoUsuarioData = signal<DetallePrestamoUsuario | null>(null);

  // ── Usuario equipos: extensión ────────────
  extensionVisible = signal(false);
  extensionData = signal<ModalExtension | null>(null);
  extensionNuevaFecha = signal('');
  extensionMotivo = signal('');
  extensionFechaError = signal(false);
  extensionMotivoError = signal(false);
  private _onConfirmExtension:
    | ((fecha: string, motivo: string) => void)
    | null = null;

  // ════════════════════════════════════════════
  // Métodos Admin Espacios
  // ════════════════════════════════════════════
  abrirDetalle(data: DetalleSolicitud): void {
    this.detalleData.set(data);
    this.detalleVisible.set(true);
  }
  cerrarDetalle(): void {
    this.detalleVisible.set(false);
  }

  abrirRechazo(id: string, onConfirm: (motivo: string) => void): void {
    this.rechazoId.set(id);
    this.motivoRechazo.set('');
    this.motivoError.set(false);
    this._onConfirmRechazo = onConfirm;
    this.rechazoVisible.set(true);
  }
  cerrarRechazo(): void {
    this.rechazoVisible.set(false);
    this._onConfirmRechazo = null;
  }
  confirmarRechazo(): void {
    const motivo = this.motivoRechazo().trim();
    if (!motivo) {
      this.motivoError.set(true);
      return;
    }
    this._onConfirmRechazo?.(motivo);
    this.cerrarRechazo();
  }

  // ════════════════════════════════════════════
  // Métodos Usuario Espacios
  // ════════════════════════════════════════════
  abrirDetalleUsuario(data: DetalleSolicitudUsuario): void {
    this.detalleUsuarioData.set(data);
    this.detalleUsuarioVisible.set(true);
  }
  cerrarDetalleUsuario(): void {
    this.detalleUsuarioVisible.set(false);
  }

  // ════════════════════════════════════════════
  // Métodos Admin Equipos
  // ════════════════════════════════════════════
  abrirDetallePrestamo(data: DetallePrestamoEquipo, notasActuales = ''): void {
    this.detallePrestamoData.set(data);
    this.notasAdmin.set(notasActuales);
    this.detallePrestamoVisible.set(true);
  }
  cerrarDetallePrestamo(): void {
    this.detallePrestamoVisible.set(false);
  }

  abrirDevolucion(data: ModalDevolucion, onConfirm: () => void): void {
    this.devolucionData.set(data);
    this.estadoEquipo.set('excelente');
    this.notasDevolucion.set('');
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.fechaDevolucion.set(now.toISOString().slice(0, 16));
    this._onConfirmDevolucion = onConfirm;
    this.devolucionVisible.set(true);
  }
  cerrarDevolucion(): void {
    this.devolucionVisible.set(false);
    this._onConfirmDevolucion = null;
  }
  confirmarDevolucion(): void {
    this._onConfirmDevolucion?.();
    this.cerrarDevolucion();
  }

  abrirRechazoPrestamo(id: string, onConfirm: (motivo: string) => void): void {
    this.rechazoPrestamoId.set(id);
    this.motivoRechazoPrestamo.set('');
    this.motivoErrorPrestamo.set(false);
    this._onConfirmRechazoPrestamo = onConfirm;
    this.rechazoPrestamoVisible.set(true);
  }
  cerrarRechazoPrestamo(): void {
    this.rechazoPrestamoVisible.set(false);
    this._onConfirmRechazoPrestamo = null;
  }
  confirmarRechazoPrestamo(): void {
    const motivo = this.motivoRechazoPrestamo().trim();
    if (!motivo) {
      this.motivoErrorPrestamo.set(true);
      return;
    }
    this._onConfirmRechazoPrestamo?.(motivo);
    this.cerrarRechazoPrestamo();
  }

  // ── Métodos Usuario Equipos ───────────────
  abrirDetallePrestamoUsuario(data: DetallePrestamoUsuario): void {
    this.detallePrestamoUsuarioData.set(data);
    this.detallePrestamoUsuarioVisible.set(true);
  }
  cerrarDetallePrestamoUsuario(): void {
    this.detallePrestamoUsuarioVisible.set(false);
  }

  abrirExtension(
    data: ModalExtension,
    onConfirm: (fecha: string, motivo: string) => void,
  ): void {
    this.extensionData.set(data);
    this.extensionNuevaFecha.set('');
    this.extensionMotivo.set('');
    this.extensionFechaError.set(false);
    this.extensionMotivoError.set(false);
    this._onConfirmExtension = onConfirm;
    this.extensionVisible.set(true);
  }
  cerrarExtension(): void {
    this.extensionVisible.set(false);
    this._onConfirmExtension = null;
  }
  confirmarExtension(): void {
    const fecha = this.extensionNuevaFecha().trim();
    const motivo = this.extensionMotivo().trim();
    this.extensionFechaError.set(!fecha);
    this.extensionMotivoError.set(!motivo);
    if (!fecha || !motivo) return;
    this._onConfirmExtension?.(fecha, motivo);
    this.cerrarExtension();
  }

  get extensionMinDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  get extensionMaxDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  }
}
