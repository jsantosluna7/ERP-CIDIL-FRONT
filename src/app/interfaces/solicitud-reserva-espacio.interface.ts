export interface Solicitud {
  id: number;
  idUsuario: number;
  idLaboratorio: number;
  horaInicio: string;
  horaFinal: string;
  fechaInicio: string;
  fechaFinal: string;
  motivo: string;
  fechaSolicitud: string;
  idEstado: number;

  nombreUsuario?: string;
  nombreLaboratorio?: string;
}
