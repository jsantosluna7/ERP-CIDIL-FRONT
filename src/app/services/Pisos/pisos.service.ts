import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';

export interface LaboratoriosPorPiso {
  1: string[]; // 1er piso
  2: string[];
  3: string[];
  4: string[]; // todo
}

@Injectable({
  providedIn: 'root',
})
export class PisosService {
  private laboratoriosPorPisoSubject = new BehaviorSubject<LaboratoriosPorPiso>(
    {
      1: ['1A', '1B', '1C', '1D'],
      2: ['2A', '2B', '2C', '2D'],
      3: ['3A', '3B', '3C', '3D'],
      4: [
        '1A',
        '1B',
        '1C',
        '1D',
        '2A',
        '2B',
        '2C',
        '2D',
        '3A',
        '3B',
        '3C',
        '3D',
      ],
    }
  );
  laboratoriosPorPiso$ = this.laboratoriosPorPisoSubject.asObservable();

  // 👇 tabList se actualiza en base al piso actual
  private pisoSubject = new BehaviorSubject<number>(1);
  piso$ = this.pisoSubject.asObservable();

  private pisoHorarioSubject = new BehaviorSubject<number>(1);
  pisoHorario$ = this.pisoHorarioSubject.asObservable();
  
  private tabListSubject = new BehaviorSubject<string[]>([]);
  tabList$ = this.tabListSubject.asObservable();

  constructor() {
    this.cargarDesdeLocalStorage();

    // Cuando cambie el piso o los laboratorios, actualiza tabList
    combineLatest([this.pisoSubject, this.laboratoriosPorPiso$]).subscribe(
      ([piso, data]: any) => {
        const list =
          piso === 4
            ? [...data[1], ...data[2], ...data[3]]
            : [...(data[piso] ?? [])];
        this.tabListSubject.next(list);
      }
    );
  }

  setPiso(piso: number) {
    this.pisoSubject.next(piso);
  }

  setPisoHorario(piso: number) {
    this.pisoHorarioSubject.next(piso);
  }

  agregarLaboratorio(nombre: string, piso: number) {
    const actual = this.laboratoriosPorPisoSubject.value;
    const nuevos: any = { ...actual };

    nuevos[piso] = [...nuevos[piso], nombre];

    // Si es piso distinto a 4, también lo agregamos al "todo"
    if (piso !== 4 && !nuevos[4].includes(nombre)) {
      nuevos[4] = [...nuevos[4], nombre];
    }

    this.laboratoriosPorPisoSubject.next(nuevos);
    this.guardarEnLocalStorage(nuevos);
  }

  eliminarLaboratorio(nombre: string, piso: number) {
    const actual = this.laboratoriosPorPisoSubject.value;
    const nuevos: any = { ...actual };

    nuevos[piso] = nuevos[piso].filter((lab: any) => lab !== nombre);
    nuevos[4] = nuevos[4].filter((lab: any) => lab !== nombre); // Siempre lo quitamos de "todo"

    this.laboratoriosPorPisoSubject.next(nuevos);
    this.guardarEnLocalStorage(nuevos);
  }

  private guardarEnLocalStorage(data: LaboratoriosPorPiso) {
    localStorage.setItem('labs', JSON.stringify(data));
  }

  private cargarDesdeLocalStorage() {
    const raw = localStorage.getItem('labs');
    if (raw) {
      try {
        const data: LaboratoriosPorPiso = JSON.parse(raw);
        this.laboratoriosPorPisoSubject.next(data);
      } catch (e) {
        console.warn('Error cargando laboratorios desde LocalStorage');
      }
    }
  }
}
