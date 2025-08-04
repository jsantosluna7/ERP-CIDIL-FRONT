export interface ReporteFalla {
  idReporte?: number; // cuando la respuesta lo incluya
  idLaboratorio: number | null;
  descripcion: string;
  nombreSolicitante: string;
  lugar: string;
  idEstado: number;
  fechaCreacion?: Date;
}
