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
import { LaboratorioCacheService } from '../../../core/LaboratorioCache/laboratorio-cache.service';
import { SolicitudReservaEspacioCacheService } from '../../../core/SolicitudReservaEspacioCache/solicitud-reserva-espacio-cache.service';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { Console } from 'console';
import { environment } from '../../../../environments/environment';

export interface Laboratorio {
  id: number;
  nombre: string;
  codigoDeLab: string;
  descripcion: string;
  capacidad: number;
  piso: number;
  imagenLaboratorio?: string;
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

  readonly IMAGENES_URL = environment.imagenesUrl + '/laboratorios/lab-no-disponible.png';

  // ── Catálogo de laboratorios ─────────────────────────────
  labsMap: Record<string, Laboratorio> = {};
  labsLista: Laboratorio[] = [];

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

  // Variables
  usuarioLogueado: any;

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
    private laboratorioCache: LaboratorioCacheService,
    private solicitudCache: SolicitudReservaEspacioCacheService,
    private _usuarios: UsuariosService,
    private toastr: ToastrService,
  ) {}

  solicitudes() {
    this.router.navigate(['/acceso/home/solicitud-laboratorio']);
  }

  misSolicitudes() {
    this.router.navigate(['/acceso/home/mis-solicitudes-espacio']);
  }

  ngOnInit(): void {
    this._usuarios.user$.subscribe((user) => {
      this.usuarioLogueado = user;
    });

    this.form = this.fb.group({
      laboratorio: ['', Validators.required],
      personas: [null, [Validators.required, Validators.min(1)]],
      fechaEvento: ['', Validators.required],
      horaFin: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.laboratorioCache.getLaboratorios().subscribe({
      next: (labs) => {
        console.log('Laboratorios cargados:', labs);

        this.labsLista = labs;

        this.labsMap = labs.reduce(
          (acc, lab) => {
            acc[lab.id] = lab;
            return acc;
          },
          {} as Record<string, Laboratorio>,
        );
      },
      error: (err) => {
        console.error('Error cargando laboratorios', err);
      },
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
    ) {
      this.toastr.warning('Revise los datos del formulario');
      return;
    }

    if (!this.usuarioLogueado) {
      this.toastr.error('Usuario no autenticado');
      return;
    }

    this.enviando = true;

    const form = this.form.value;

    const dtInicio = new Date(form.fechaEvento);

    // EXACTAMENTE igual que tu código anterior
    const horaInicio = dtInicio.toTimeString().split(' ')[0]; // HH:mm:ss
    const horaFinal = `${form.horaFin}:00`;

    const fechaInicio = dtInicio.toISOString().split('T')[0] + 'T00:00:00';
    const fechaFinal = fechaInicio;

    const payload = {
      idUsuario: Number(this.usuarioLogueado.sub),
      idLaboratorio: Number(form.laboratorio),
      personasCantidad: Number(form.personas),

      horaInicio: horaInicio,
      horaFinal: horaFinal,

      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,

      motivo: form.motivo,
      fechaSolicitud: new Date().toISOString(),
    };

    console.log('Payload enviado:', payload);

    this.solicitudCache.crearSolicitud(payload).subscribe({
      next: () => {
        this.enviando = false;
        this.toastr.success(
          'La solicitud fue enviada correctamente',
          'Solicitud creada',
        );
        this.router.navigate(['/acceso/home/mis-solicitudes-espacio']);
      },
      error: (err) => {
        this.enviando = false;
        console.error(err);
        this.toastr.error(err.error?.error || 'Error al crear solicitud');
      },
    });
  }
}
