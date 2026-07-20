export interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  fechaCreacion?: string;
  fechaPublicacion: string;
  esPasantia?: boolean;
  esCarrusel: boolean;
}

export interface CrearAnuncioDTO {
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  esPasantia: boolean;
  esCarrusel: boolean;
}
