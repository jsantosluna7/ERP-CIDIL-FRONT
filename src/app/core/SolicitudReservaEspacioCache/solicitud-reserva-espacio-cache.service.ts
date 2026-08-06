import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudReservaEspacioCacheService {
  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_RESERVA_ESPACIO']}`;
  private apiUrlConteo = `${process.env['API_URL']}${process.env['ENDPOINT_TOTAL_RESERVA_ESPACIO_CONTEO']}`;
  private apiUrlTotalReserva = `${process.env['API_URL']}${process.env['ENDPOINT_TOTAL_RESERVA_ESPACIO']}`;
  private apiUrlCrearReserva = `${process.env['API_URL']}${process.env['ENDPOINT_CREAR_RESERVA_ESPACIO']}`;

  private cache = new Map<string, Observable<any>>();

  //cache con expiración para conteo
  private cacheConteo: { data: any; expiry: number } | null = null;

  // cache para total reservas (2 minutos)
  // Caché indexado por filtros (estado + búsqueda)
  private cacheTotalReservas: Record<string, { data: any; expiry: number }> =
    {};

  private cacheTotalReservasUsuario: Record<string, { data: any; expiry: number }> =
    {};
  // Constantes de paginación
  private readonly PAGINA_DEFAULT = 1;
  private readonly TAMANO_PAGINA_DEFAULT = 20;

  constructor(private http: HttpClient) {}

  // TODAS LAS SOLICITUDES
  obtenerSolicitudes(): Observable<any[]> {
    const url = `${this.apiUrl}/obtener-solicitudes-reservas`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any[]>(url).pipe(shareReplay(1));
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // SOLICITUDES POR PISO
  obtenerSolicitudesPorPiso(piso: number): Observable<any[]> {
    const url = `${this.apiUrl}/obtener-solicitudes-reservas-piso/${piso}`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any[]>(url).pipe(shareReplay(1));
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // SOLICITUD POR ID
  obtenerSolicitudPorId(id: number): Observable<any> {
    const url = `${this.apiUrl}/obtener-solicitudes-reservas/${id}`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any>(url).pipe(shareReplay(1));
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // MIS SOLICITUDES
  obtenerMisSolicitudes(): Observable<any[]> {
    const url = `${this.apiUrl}/mis-solicitudes-espacios`;

    if (!this.cache.has(url)) {
      const request$ = this.http.get<any[]>(url).pipe(shareReplay(1));
      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  // CONTEO DE RESERVAS (CACHE 30s)
  obtenerConteoReservas(): Observable<any> {
    const ahora = Date.now();

    if (this.cacheConteo && ahora < this.cacheConteo.expiry) {
      return of(this.cacheConteo.data);
    }

    return this.http.get<any>(this.apiUrlConteo).pipe(
      tap((data) => {
        this.cacheConteo = {
          data,
          expiry: ahora + 30000, // 30 segundos
        };
      }),
    );
  }

  // TOTAL RESERVAS ESPACIO (2 minutos)

  // TOTAL RESERVAS ESPACIO (2 minutos)
  obtenerTotalReservasEspacioUsuario(params?: {
    idEstado?: number;
    idUsuario: number;
  }): Observable<any> {
    // Construir query string para usar como clave de caché única por combinación de filtros
    const cacheKey = JSON.stringify(params ?? {});
    const ahora = Date.now();

    if (
      this.cacheTotalReservasUsuario?.[cacheKey] &&
      ahora < this.cacheTotalReservasUsuario[cacheKey].expiry
    ) {
      return of(this.cacheTotalReservasUsuario[cacheKey].data);
    }

    // Construir HttpParams solo con los valores definidos
    let httpParams = new HttpParams();
    if (params?.idEstado !== undefined)
      httpParams = httpParams.set('idEstado', params.idEstado.toString());

    return this.http
      .get<any>(`${this.apiUrlTotalReserva}/${params?.idUsuario}`, { params: httpParams })
      .pipe(
        tap((data) => {
          // Caché por clave única (filtros + paginación)
          if (!this.cacheTotalReservasUsuario) this.cacheTotalReservasUsuario = {};
          this.cacheTotalReservasUsuario[cacheKey] = {
            data,
            expiry: ahora + 120000, // 2 minutos
          };
        }),
      );
  }

  // TOTAL RESERVAS ESPACIO (2 minutos)
  obtenerTotalReservasEspacio(params?: {
    idEstado?: number;
    busqueda?: string;
    pagina?: number;
    tamanoPagina?: number;
  }): Observable<any> {
    // Construir query string para usar como clave de caché única por combinación de filtros
    const cacheKey = JSON.stringify(params ?? {});
    const ahora = Date.now();

    if (
      this.cacheTotalReservas?.[cacheKey] &&
      ahora < this.cacheTotalReservas[cacheKey].expiry
    ) {
      return of(this.cacheTotalReservas[cacheKey].data);
    }

    // Construir HttpParams solo con los valores definidos
    let httpParams = new HttpParams();
    if (params?.idEstado !== undefined)
      httpParams = httpParams.set('idEstado', params.idEstado.toString());
    if (params?.busqueda !== undefined)
      httpParams = httpParams.set('busqueda', params.busqueda);
    if (params?.pagina !== undefined)
      httpParams = httpParams.set('pagina', params.pagina.toString());
    if (params?.tamanoPagina !== undefined)
      httpParams = httpParams.set(
        'tamanoPagina',
        params.tamanoPagina.toString(),
      );

    return this.http
      .get<any>(this.apiUrlTotalReserva, { params: httpParams })
      .pipe(
        tap((data) => {
          // Caché por clave única (filtros + paginación)
          if (!this.cacheTotalReservas) this.cacheTotalReservas = {};
          this.cacheTotalReservas[cacheKey] = {
            data,
            expiry: ahora + 120000, // 2 minutos
          };
        }),
      );
  }

  // CREAR SOLICITUD
  crearSolicitud(data: any): Observable<any> {
    this.limpiarCache();
    return this.http.post(`${this.apiUrl}/crear-solicitud-reserva`, data);
  }

  // EDITAR SOLICITUD
  editarSolicitud(id: number, data: any): Observable<any> {
    this.limpiarCache();
    return this.http.put(`${this.apiUrl}/editar-solicitud-reserva/${id}`, data);
  }

  // AÑADIR RESERVA
  anadirReserva(data: any): Observable<any> {
    this.limpiarCache();
    return this.http.post(`${this.apiUrlCrearReserva}`, data);
  }

  // CANCELAR SOLICITUD
  cancelarSolicitud(id: number): Observable<any> {
    this.limpiarCache();
    return this.http.delete(`${this.apiUrl}/cancelar-solicitud-reserva/${id}`);
  }

  // LIMPIAR CACHE
  limpiarCache() {
    this.cache.clear();
    this.cacheConteo = null;
    this.cacheTotalReservas = {};
  }
}
