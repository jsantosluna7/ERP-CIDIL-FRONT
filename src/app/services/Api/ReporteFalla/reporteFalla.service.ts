import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReporteFalla } from "../../../interfaces/reporteFalla.interface";

@Injectable({
    providedIn: 'root'
})
export class ReporteFallaService{


  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOIN_REPORTEFALL']}`;

  constructor(private http: HttpClient) {}


 crearReporte(reporte: ReporteFalla): Observable<ReporteFalla> {
    return this.http.post<ReporteFalla>(`${this.apiUrl}`, reporte);
  }

  getReportes(): Observable<ReporteFalla[]> {
    return this.http.get<ReporteFalla[]>(`${this.apiUrl}`);
  }
/*
 actualizarReporte(id: number, reporte: Partial<ReporteFalla>): Observable<ReporteFalla> {
    return this.http.put<ReporteFalla>(`${this.apiUrl}/${id}`, reporte);
  }
*/

actualizarReporte(id: number, dto: { IdReporte: number; IdEstado: number }): Observable<ReporteFalla> {
  return this.http.put<ReporteFalla>(`${this.apiUrl}/${id}`, dto);
}

}