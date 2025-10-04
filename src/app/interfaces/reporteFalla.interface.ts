export interface ReporteFalla {
  idReporte?: number; // cuando la respuesta lo incluya
  descripcion: string;
  lugar: string;
  idUsuario: number;
  estado: number;
  fechaCreacion?: Date;
}
