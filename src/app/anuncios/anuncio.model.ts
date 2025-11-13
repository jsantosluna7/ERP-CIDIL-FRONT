export interface Anuncio {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  cantidadLikes?: number;
  comentarios: any[];
  fechaPublicacion?: string; // ✅ <-- esta línea soluciona el error
  Islike:boolean;
}



  export interface Comentario {
  id: number;
  texto: string;
  usuario?: string;
}






