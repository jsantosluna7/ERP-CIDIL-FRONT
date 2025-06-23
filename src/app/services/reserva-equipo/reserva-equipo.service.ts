import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReservaEquipos } from "../../interfaces/solicitud-reserva-equipos.interface";





@Injectable({
  providedIn: 'root'
})

export class SolicitudEquipoService{
private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDRE']}`;
private apiUrlE = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDEQUIPO']}`;

constructor(private http: HttpClient){}

getReservaE(): Observable<ReservaEquipos[]> {
    return this.http.get<ReservaEquipos[]>(this.apiUrl)
}

updateEstado(id: number, body: any) {
  return this.http.put(`${this.apiUrlE}/${id}`, body);
}


}
