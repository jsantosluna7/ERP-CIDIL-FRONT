export interface Usuarios{
    id: number;
    nombre:string;
    apellido:string;
    matricula:number;
    email:string;
    telefono:string;
    direccion:string;
    rol:'Estudiante' | 'Administrador' | 'Super Usuario';
}