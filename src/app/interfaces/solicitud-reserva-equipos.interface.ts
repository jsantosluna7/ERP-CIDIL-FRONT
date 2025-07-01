export interface ReservaEquipos{
    id:number;
    idUsuario: number;
    idInventario: number;
    fechaInicio: string;
    fechaFinal: string;
    motivo: string;
    fechaEntrega: string;
    idEstado:number;
    idUsuarioAprobador: number;
    comentarioAprobacion: string;
    cantidad:number;

    // Campos adicionales para mostrar en frontend
   nombreUsuario?: string;
   nombreEquipo?: string;

}