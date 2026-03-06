import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface Laboratorio {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  imagen: string; // Reemplaza con la ruta real: 'assets/labs/lab1.jpg'
}

// ── Horarios permitidos ──────────────────────────────────────
// Lun-Vie: 08:00–22:00 | Sáb: 08:00–18:00 | Dom: cerrado
const HORARIOS: Record<number, { open: number; close: number } | null> = {
  0: null, // Domingo: cerrado
  1: { open: 8, close: 22 }, // Lunes
  2: { open: 8, close: 22 }, // Martes
  3: { open: 8, close: 22 }, // Miércoles
  4: { open: 8, close: 22 }, // Jueves
  5: { open: 8, close: 22 }, // Viernes
  6: { open: 8, close: 18 }, // Sábado
};

@Component({
  selector: 'app-reserva-laboratorio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './reserva-laboratorio.component.html',
  styleUrl: './reserva-laboratorio.component.css',
})
export class ReservaLaboratorioComponent implements OnInit {
  // ── Catálogo de laboratorios ─────────────────────────────
  labsMap: Record<string, Laboratorio> = {
    lab1: {
      id: 'lab1',
      nombre: 'Laboratorio de Cómputo A',
      ubicacion: 'Piso 2',
      capacidad: 30,
      imagen: 'assets/labs/lab-computo-a.jpg',
    },
    lab2: {
      id: 'lab2',
      nombre: 'Laboratorio de Cómputo B',
      ubicacion: 'Piso 2',
      capacidad: 25,
      imagen: 'assets/labs/lab-computo-b.jpg',
    },
    sala1: {
      id: 'sala1',
      nombre: 'Sala de Conferencias',
      ubicacion: 'Piso 1',
      capacidad: 80,
      imagen: 'assets/labs/sala-conferencias.jpg',
    },
    sala2: {
      id: 'sala2',
      nombre: 'Sala de Reuniones',
      ubicacion: 'Piso 3',
      capacidad: 15,
      imagen: 'assets/labs/sala-reuniones.jpg',
    },
    aula1: {
      id: 'aula1',
      nombre: 'Aula Magna',
      ubicacion: 'Planta Baja',
      capacidad: 200,
      imagen: 'assets/labs/aula-magna.jpg',
    },
  };

  labsLista: Laboratorio[] = Object.values(this.labsMap);

  // ── Estado ───────────────────────────────────────────────
  labSeleccionado: Laboratorio | null = null;
  duracionTexto = '';
  enviando = false;
  excedeCapacidad = false;
  fechaEventoError: string | null = null;
  horaFinError: string | null = null;

  // Datetime mínimo = ahora (no se pueden crear reservas en el pasado)
  minDatetime = this.toDatetimeLocal(new Date());

  form!: FormGroup;

  // ── Computed ─────────────────────────────────────────────
  get personasValue(): number {
    return this.form.get('personas')?.value ?? 0;
  }

  get ocupacionPct(): number {
    if (!this.labSeleccionado || !this.personasValue) return 0;
    return Math.min(
      (this.personasValue / this.labSeleccionado.capacidad) * 100,
      100,
    );
  }

  // ── Lifecycle ────────────────────────────────────────────
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  solicitudes() {
    this.router.navigate(['/home/solicitud-laboratorio']);
  }

  misSolicitudes() {
    this.router.navigate(['/home/mis-solicitudes-espacio']);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      laboratorio: ['', Validators.required],
      personas: [null, [Validators.required, Validators.min(1)]],
      fechaEvento: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // ── Helpers ──────────────────────────────────────────────

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  /** Convierte un Date a string compatible con datetime-local input */
  private toDatetimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  /**
   * Valida si un datetime está dentro del horario permitido.
   * Devuelve null si es válido o un string con el mensaje de error.
   */
  private validarHorario(date: Date): string | null {
    const diaSemana = date.getDay(); // 0=Dom … 6=Sáb
    const horario = HORARIOS[diaSemana];

    if (!horario) return 'Los domingos no hay atención';

    const hora = date.getHours() + date.getMinutes() / 60;

    if (hora < horario.open) return `El espacio abre a las ${horario.open}:00`;
    if (hora >= horario.close) {
      const cierre = `${horario.close}:00`;
      return `El espacio cierra a las ${cierre}`;
    }
    return null;
  }

  // ── Handlers ─────────────────────────────────────────────

  onLabChange(): void {
    const id = this.form.get('laboratorio')?.value;
    this.labSeleccionado = this.labsMap[id] ?? null;
    this.excedeCapacidad = false;
    this.onPersonasChange();
  }

  onPersonasChange(): void {
    if (!this.labSeleccionado || !this.personasValue) {
      this.excedeCapacidad = false;
      return;
    }
    this.excedeCapacidad = this.personasValue > this.labSeleccionado.capacidad;
  }

  cambiarCantidad(delta: number): void {
    const actual = this.form.get('personas')?.value ?? 0;
    this.form.get('personas')?.setValue(Math.max(1, actual + delta));
    this.form.get('personas')?.markAsTouched();
    this.onPersonasChange();
  }

  onFechaChange(): void {
    this.fechaEventoError = null;
    const val = this.form.get('fechaEvento')?.value;
    if (!val) return;

    const fecha = new Date(val);
    this.fechaEventoError = this.validarHorario(fecha);

    // Re-validar hora de fin con la nueva fecha
    this.onHoraFinChange();
    this.calcularDuracion();
  }

  onHoraFinChange(): void {
    this.horaFinError = null;
    const fechaVal = this.form.get('fechaEvento')?.value;
    const finVal = this.form.get('horaFin')?.value;
    if (!fechaVal || !finVal) return;

    const inicio = new Date(fechaVal);
    const [hFin, mFin] = finVal.split(':').map(Number);
    const fin = new Date(inicio);
    fin.setHours(hFin, mFin, 0, 0);

    if (fin <= inicio) {
      this.horaFinError = 'La hora de fin debe ser posterior al inicio';
      this.duracionTexto = '';
      return;
    }

    // Validar que la hora de fin esté dentro del horario
    this.horaFinError = this.validarHorario(fin);
    this.calcularDuracion();
  }

  calcularDuracion(): void {
    this.duracionTexto = '';
    const fechaVal = this.form.get('fechaEvento')?.value;
    const finVal = this.form.get('horaFin')?.value;
    if (!fechaVal || !finVal || this.horaFinError) return;

    const inicio = new Date(fechaVal);
    const [hFin, mFin] = finVal.split(':').map(Number);
    const fin = new Date(inicio);
    fin.setHours(hFin, mFin, 0, 0);

    const diff = fin.getTime() - inicio.getTime();
    if (diff <= 0) return;

    const totalMin = Math.round(diff / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;

    this.duracionTexto =
      h > 0
        ? `Duración: ${h}h${m > 0 ? ' ' + m + 'min' : ''}`
        : `Duración: ${m} minutos`;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    this.onPersonasChange();
    this.onFechaChange();

    if (
      this.form.invalid ||
      this.excedeCapacidad ||
      this.fechaEventoError ||
      this.horaFinError
    )
      return;

    this.enviando = true;

    const payload = { ...this.form.value };
    console.log('Enviando reserva de espacio:', payload);

    // Reemplaza con tu servicio:
    // this.reservaService.crearEspacio(payload).subscribe({
    //   next: () => { this.enviando = false; this.router.navigate(['/solicitudes']); },
    //   error: err => { this.enviando = false; console.error(err); }
    // });

    setTimeout(() => {
      this.enviando = false;
      alert('¡Solicitud enviada correctamente!');
    }, 1800);
  }
}
