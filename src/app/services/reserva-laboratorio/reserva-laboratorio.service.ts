import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Solicitud } from "../../interfaces/solicitud-reserva-espacio.interface";




@Injectable({
  providedIn: 'root'
})

export class SolicitudReservaService{

private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDR']}`;

constructor(private http: HttpClient){}


getResevas(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl)
}


}