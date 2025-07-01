export interface Carta {
  id: number; // opcional si es generado por el backend
  nombre: string;
  nombreData?:string;
  nombreCorto: string;
  perfil: string;
  idLaboratorio: number;
  fabricante: string;
  modelo: string;
  serial: string;
  descripcionLarga: string;
  fechaTransaccion: string; // formato ISO: "2025-06-27T17:13:26.939Z"
  departamento: string;
  importeActivo: number;
  imagenEquipo: string;
  disponible: boolean;
  idEstadoFisico: number;
  validacionPrestamo: boolean;

  // Campos adicionales para el frontend (no van al backend, pero útiles en Angular)
  cantidad?: number;
  cantidadSeleccionada: number;

}



export interface PaginacionResponse {
  paginaActual: number;
  tamanoPagina: number;
  totalInventario: number;
  totalPaginas: number;
}
