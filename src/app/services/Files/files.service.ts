import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { DatosService } from '../Datos/datos.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private papa: Papa, private _valores: DatosService) {}

  public procesarCSV(file: File): void {
    this.papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        this._valores.obtenerData(data);
      },
      error: (error) => {
        console.error('Error al leer el archivo CSV', error);
      },
    });
  }

  public procesarExcel(file: File): void {
    const lector = new FileReader();
    lector.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const listaPlana: any[] = [];

      workbook.SheetNames.forEach(sheetName => {
        const ws = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(ws, {defval: ''});
        listaPlana.push(...jsonData);
      });

        this._valores.obtenerData(listaPlana);
    };

    lector.onerror = (error) => {
      console.error('Error al leer el archivo Excel:', error);
    };

    lector.readAsArrayBuffer(file);
  }
}
