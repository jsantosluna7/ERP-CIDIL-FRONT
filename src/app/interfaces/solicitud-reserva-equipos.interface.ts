export interface ReservaEquipos{
    id:number;
    idUsuario: number;
    idInventario: number;
    fechaInicio: string;
    fechaFinal: string;
    motivo: string;
    fechaSolicitud: string;
    idEstado:number;
}