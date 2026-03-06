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
  estado: string;
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

@Injectable({ providedIn: 'root' })
export class ModalStateService {

  // ── Admin: detalle solicitud ───────────────
  detalleVisible = signal(false);
  detalleData    = signal<DetalleSolicitud | null>(null);

  // ── Admin: rechazo ─────────────────────────
  rechazoVisible = signal(false);
  rechazoId      = signal('');
  motivoRechazo  = signal('');
  motivoError    = signal(false);
  private _onConfirm: ((motivo: string) => void) | null = null;

  // ── Usuario: detalle solicitud propia ──────
  detalleUsuarioVisible = signal(false);
  detalleUsuarioData    = signal<DetalleSolicitudUsuario | null>(null);

  // ── Admin: detalle ─────────────────────────
  abrirDetalle(data: DetalleSolicitud): void {
    this.detalleData.set(data);
    this.detalleVisible.set(true);
  }
  cerrarDetalle(): void {
    this.detalleVisible.set(false);
  }

  // ── Admin: rechazo ─────────────────────────
  abrirRechazo(id: string, onConfirm: (motivo: string) => void): void {
    this.rechazoId.set(id);
    this.motivoRechazo.set('');
    this.motivoError.set(false);
    this._onConfirm = onConfirm;
    this.rechazoVisible.set(true);
  }
  cerrarRechazo(): void {
    this.rechazoVisible.set(false);
    this._onConfirm = null;
  }
  confirmarRechazo(): void {
    const motivo = this.motivoRechazo().trim();
    if (!motivo) { this.motivoError.set(true); return; }
    this._onConfirm?.(motivo);
    this.cerrarRechazo();
  }

  // ── Usuario: detalle ───────────────────────
  abrirDetalleUsuario(data: DetalleSolicitudUsuario): void {
    this.detalleUsuarioData.set(data);
    this.detalleUsuarioVisible.set(true);
  }
  cerrarDetalleUsuario(): void {
    this.detalleUsuarioVisible.set(false);
  }
}