export interface Laboratorio {
  id: number;
  codigoDeLab: string;
  capacidad: number;
  descripcion: string;
  nombre: string;
  piso: number;
  activado: boolean;
}
export interface SolicitudReserva {
  idUsuario: number;
  idLaboratorio: number;
  horaInicio: string;
  horaFinal: string;
  fechaInicio:string;
  fechaFinal:string;
  motivo: string;
  fechaSolicitud: string;
  //idEstado: number;
  laboratorio?: any[];
}