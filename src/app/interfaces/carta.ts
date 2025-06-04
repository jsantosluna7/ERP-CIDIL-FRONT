export interface Carta {
    id: number;
    nombre:string;
    descripcionLarga:string;
    cantidad:number;
    disponible: boolean;
    imagenEquipo:string;
}

export interface PaginacionResponse {
  paginaActual: number;
  tamanoPagina: number;
  totalInventario: number;
  totalPaginas: number;
}
