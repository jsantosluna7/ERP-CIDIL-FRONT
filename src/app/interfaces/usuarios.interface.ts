export interface Usuarios{
    id: number;
    IdMatricula: number;
    nombreUsuario:string;
    apellidoUsuario:string;
    correoInstitucional:string;
    telefono:string;
    direccion:string;
    activado: boolean;
    idrol:'Estudiante' | 'Administrador' | 'Super Usuario';
}

export interface RespuestaUsuarios {
  datos: Usuarios[];
  paginacion: {
    paginaActual: number;
    tamanoPagina: number;
    totalUsuarios: number;
    totalPaginas: number;
  };
}