import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ReservaEquipos } from "../../interfaces/solicitud-reserva-equipos.interface";
import { ReservaEquipoNueva } from "../../interfaces/reservaEquipoNueva.interface";
import { Carta } from "../../interfaces/carta";
import { ReservaEquipoComponent } from "../../components/home/reserva-equipo/reserva-equipo.component";





@Injectable({
  providedIn: 'root'
})

export class SolicitudEquipoService{
private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDRE']}`;
private apiUrlE = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDEQUIPO']}`;
private apiUrlUP = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDEUP']}`;
private apiUrlDLT = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDDELETE']}`;

constructor(private http: HttpClient){}

getReservaE(): Observable<{datos: ReservaEquipos[]}> {
    return this.http.get<{datos: ReservaEquipos[]}>(this.apiUrl);
}

updateEstado( body: any) {
  return this.http.post(`${this.apiUrlUP}`, body);
 
}

crearReserva(reserva: ReservaEquipoNueva): Observable<any> {

  return this.http.post(`${this.apiUrlE}`, reserva);
}



eliminarSolicitud(id: number){
  return this.http.delete(`${this.apiUrlDLT}/${id}`);
}

}
