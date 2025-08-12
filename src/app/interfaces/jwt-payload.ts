export interface JwtPayload {
  apellidoUsuario: string;
  aud: string;
  correoInstitucional: string;
  direccion: string;
  exp: number;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
  idMatricula: string;
  idRol: string;
  iss: string;
  nombreUsuario: string;
  sub: string;
  telefono: string;
  ultimaSesion: string;
}
