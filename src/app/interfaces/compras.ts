export interface OrdenSolicitud {
  id: number;
  codigo: string;
  nombre: string;
  comentario: string;
  solicitadoPor: string;
  creadoPor: number;
  departamento: string | null;
  unidadNegocio: string;
  estadoTimelineId: number;
  itemsCount: number;
  itemsRecibidos: number;
  fechaSolicitud: string; // YYYY-MM-DD
  fechaSubida: string; // YYYY-MM-DD
  actualizadoEn: string; // ISO datetime
  timeline: Timeline;
  items?: ItemOrden[];
  loadingItems?: boolean;
  itemsLoaded?: boolean;
}

export interface ItemOrden {
  id: number;
  ordenId: number;
  numeroLista: string;
  nombre: string;
  cantidad: number;
  cantidadRecibida: number;
  comentario: string | null;
  estadoTimelineId: number;
  actualizadoEn: string;
  estadosTimeline: Timeline;
  fechaActualizacion: string;
}

export interface Timeline {
  id: number;
  activo: boolean;
  codigo: string;
  color: string;
  icono: string;
  nombre: string;
}

export interface TimelineOrden {
  fechaEvento: string;
  fechaActualizacion: string;
  evento: string;
  estadoTimelineId: number;
  estadosTimeline: Timeline;
  usuario: string;
}
