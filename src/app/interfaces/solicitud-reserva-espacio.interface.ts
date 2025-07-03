export interface Solicitud{
id:number;    
idUsuario: number;
idLaboratorio:number;
horaInicio:String;
horaFinal:String;
fechaInicio: string;
fechaFinal:string;
motivo:String;
fechaSolicitud:string;
idEstado:number;

nombreUsuario?: string;
nombreLaboratorio?: string;

}