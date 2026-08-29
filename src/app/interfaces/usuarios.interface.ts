export interface Usuarios {
  id: number;
  sub: number;
  idMatricula: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  correoInstitucional: string;
  telefono: string;
  direccion: string;
  activado?: boolean;
  /**
   * FIX: el campo real que envía el backend es `idRol` (numérico: 1
   * Superusuario, 2 Administrador, 3 Profesor, 4 Estudiante), no el string
   * enum `idrol` que se había asumido antes.
   */
  idRol: number;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
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