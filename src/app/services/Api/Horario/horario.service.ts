import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from '../../Utilities/utilities.service';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  hoyFormateado: string | null;

  constructor(
    private http: HttpClient,
    private _utilities: UtilitiesService,
    private _date: DatePipe
  ) {
    this.hoyFormateado = this._date.transform(new Date(), 'dd/MM/yyyy hh:mm a');
  }

  getHorario(
    endpoint: string,
    pagina: number = 1,
    tamanoPagina: number = 20
  ): Observable<any> {
    return this.http.get(
      `${endpoint}?pagina=${pagina}&tamanoPagina=${tamanoPagina}`
    );
  }

  getHorarioCalendario(endpoint: string, params?: any): Observable<any> {
    return this.http.get(endpoint, params);
  }

  getIdLaboratorio(endpoint: string, codigo: string): Observable<any> {
    return this.http.get(`${endpoint}?codigo=${codigo}`);
  }

  getAllLaboratorio(endpoint: string): Observable<any> {
    return this.http.get(endpoint);
  }

  postHorario(endpoint: string, body: any): Observable<any> {
    return this.http.post(endpoint, body);
  }

  putHorario(endpoint: string, id: string, body: any): Observable<any> {
    return this.http.put(`${endpoint}/${id}`, body);
  }

  deleteHorario(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${endpoint}/${id}`);
  }

  deleteHorarioAuto(endpoint: string): Observable<any> {
    return this.http.delete(`${endpoint}?eliminar=true`);
  }

  async buildHTML(allMensajes: string[]) {
    const conBD = allMensajes.filter((m) => m.includes('BD'));
    const sinBD = allMensajes
      .filter((m) => !m.includes('BD'))
      .map((m) => {
        return this._utilities.formatearHoraError(m);
      });

    const makeList = (items: string[]) =>
      `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;

    var html = '';

    if (!conBD) {
      html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body>
          <h2><strong>Conflictos de horario en el archivo exportado</strong></h2>
          ${makeList(sinBD)}
        </body></html>`;
    } else if (!sinBD) {
      html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h2><strong>Conflictos de horario en la base de datos</strong></h2>
          ${makeList(conBD)}
        </body></html>`;
    } else {
      html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body>
          <h2><strong>Conflictos de horario en la base de datos</strong></h2>
          ${makeList(conBD)}
          <h2><strong>Conflictos de horario en el archivo exportado</strong></h2>
          ${makeList(sinBD)}
        </body></html>`;
    }

    let blob = await asBlob(html);
    // Ensure blob is a Blob instance for file-saver
    if (!(blob instanceof Blob)) {
      blob = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
    }
    saveAs(blob, `Solapamiento de horario: ${this.hoyFormateado}.docx`);
  }
}
