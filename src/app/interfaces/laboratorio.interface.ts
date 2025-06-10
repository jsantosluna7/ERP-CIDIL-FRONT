export interface Laboratorio {
  id: number;
  codigoDeLab: string;
  capacidad: number;
  descripcion: string;
  nombre: string;
  piso: string;
  activado: boolean;
}
export interface SolicitudReserva {
  laboratorioId: number;
  fechaInicio: string;
  fechaDevolucion: string;
  motivo: string;
  comentarioAprobacion?: string;
  laboratorio?: any[]; // según lo que estés usando
}