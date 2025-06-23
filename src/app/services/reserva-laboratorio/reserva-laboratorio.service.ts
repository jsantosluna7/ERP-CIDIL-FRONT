import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Solicitud } from "../../interfaces/solicitud-reserva-espacio.interface";




@Injectable({
  providedIn: 'root'
})

export class SolicitudReservaService{

private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDR']}`;
private apiUrlP = `${process.env['API_URL']}${process.env['ENDPOINT_SOLICITUDLB']}`;

constructor(private http: HttpClient){}


getResevas(): Observable<{datos: Solicitud[]}> {
    return this.http.get<{datos: Solicitud[]}>(this.apiUrl)
}

updateEstado( body: any) {
    console.log('Llamando updateEstado con id:', ' y body:', body);
  return this.http.post(`${this.apiUrlP}`, body);
  
}



}