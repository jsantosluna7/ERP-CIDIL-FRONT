export interface Carta {
    id: number;
    nombre:string;
    descripcionLarga:string;
    cantidad:number;
    disponible: boolean;
    imagenEquipo:string;
    idLaboratorio:number;
    nombreData: string;
    cantidadSeleccionada:number;


}



export interface PaginacionResponse {
  paginaActual: number;
  tamanoPagina: number;
  totalInventario: number;
  totalPaginas: number;
}
