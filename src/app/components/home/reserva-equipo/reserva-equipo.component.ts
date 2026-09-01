import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';

export interface Equipo {
  id: string | number;
  nombre: string;
  imagenUrl: string;
  cantidad: number;
  stock: number;
}

// ─── Constantes de horario ────────────────────────────────────────────────────
const HORARIO = {
  // 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab
  diasHabiles: [1, 2, 3, 4, 5],
  sabado: 6,
  domingo: 0,
  apertura: 8,           // 08:00 todos los días habiles y sábado
  cierreSemana: 22,      // 22:00 lun–vie
  cierreSabado: 18,      // 18:00 sábado
};

// ─── Validador de fecha/horario ───────────────────────────────────────────────
function validarHorario(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const fecha = new Date(value);
  const dia   = fecha.getDay();
  const hora  = fecha.getHours() + fecha.getMinutes() / 60;

  // Domingo: cerrado
  if (dia === HORARIO.domingo) {
    return { horarioInvalido: 'Los domingos no hay servicio. Elige otro día.' };
  }

  // Apertura común
  if (hora < HORARIO.apertura) {
    return { horarioInvalido: 'El horario de apertura es a las 8:00 AM.' };
  }

  // Sábado: cierra 18:00
  if (dia === HORARIO.sabado && hora >= HORARIO.cierreSabado) {
    return { horarioInvalido: 'Los sábados el servicio cierra a las 6:00 PM.' };
  }

  // Lun–Vie: cierra 22:00
  if (HORARIO.diasHabiles.includes(dia) && hora >= HORARIO.cierreSemana) {
    return { horarioInvalido: 'De lunes a viernes el servicio cierra a las 10:00 PM.' };
  }

  return null;
}

// ─── Validador cruzado: fin > inicio ─────────────────────────────────────────
function finPosteriorAlInicio(group: AbstractControl): ValidationErrors | null {
  const inicio = group.get('horaInicio')?.value;
  const fin    = group.get('horaFin')?.value;
  if (!inicio || !fin) return null;
  return new Date(fin) > new Date(inicio) ? null : { finAnteriorAlInicio: true };
}

@Component({
  selector: 'app-reserva-equipos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppCualRolDirective],
  templateUrl: './reserva-equipo.component.html',
  styleUrl: './reserva-equipo.component.css'
})
export class ReservaEquipoComponent implements OnInit {

  form!: FormGroup;
  equiposSeleccionados: Equipo[] = [];
  duracionTexto = '';
  enviando = false;

  // Mock — reemplazar con servicio real
  private equiposMock: Equipo[] = [
    {
      id: 'EQ-001',
      nombre: 'MacBook Pro 14"',
      imagenUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
      cantidad: 2,
      stock: 5
    },
    {
      id: 'EQ-047',
      nombre: 'Proyector Epson X49',
      imagenUrl: '',
      cantidad: 1,
      stock: 3
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        horaInicio: ['', [Validators.required, validarHorario]],
        horaFin:    ['', [Validators.required, validarHorario]],
        motivo:     ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
      },
      { validators: finPosteriorAlInicio }
    );

    // PRODUCCION: this.equiposSeleccionados = this.carritoService.getEquipos();
    this.equiposSeleccionados = [...this.equiposMock];
  }

  // ─── Helpers template ─────────────────────────────────────────────────────
  isInvalid(campo: string): boolean {
    const ctrl = this.form.get(campo);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  getError(campo: string): string {
    const ctrl = this.form.get(campo);
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required'])      return 'Este campo es requerido.';
    if (ctrl.errors['minlength'])     return `Mínimo ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    if (ctrl.errors['horarioInvalido']) return ctrl.errors['horarioInvalido'];
    return 'Valor inválido.';
  }

  // ─── Duración ─────────────────────────────────────────────────────────────
  onFechaChange(): void {
    const inicio = this.form.get('horaInicio')?.value;
    const fin    = this.form.get('horaFin')?.value;

    if (!inicio || !fin) { this.duracionTexto = ''; return; }

    const diff = new Date(fin).getTime() - new Date(inicio).getTime();
    if (diff <= 0) { this.duracionTexto = ''; return; }

    const h = Math.floor(diff / 3600000);
    const m = Math.round((diff % 3600000) / 60000);

    this.duracionTexto = h > 0 && m > 0 ? `${h}h ${m}min`
                       : h > 0           ? `${h} hora${h > 1 ? 's' : ''}`
                       :                   `${m} minutos`;
  }

  // ─── Equipos ──────────────────────────────────────────────────────────────
  removeEquipo(index: number): void {
    this.equiposSeleccionados.splice(index, 1);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    if (this.equiposSeleccionados.length === 0) {
      alert('Agrega al menos un equipo a la solicitud.');
      return;
    }

    this.enviando = true;

    const payload = {
      equipos:    this.equiposSeleccionados.map(e => ({ id: e.id, cantidad: e.cantidad })),
      horaInicio: this.form.value.horaInicio,
      horaFin:    this.form.value.horaFin,
      motivo:     this.form.value.motivo,
    };

    console.log('Payload:', payload);

    // Reemplaza con tu servicio:
    // this.reservaService.crear(payload).subscribe({
    //   next: () => { this.enviando = false; this.router.navigate(['/acceso/solicitudes']); },
    //   error: err => { this.enviando = false; console.error(err); }
    // });

    setTimeout(() => {
      this.enviando = false;
      alert('¡Solicitud enviada correctamente!');
    }, 1800);
  }

  irSolicitudes(): void {
    this.router.navigate(['/home/solicitud-equipo']);
  }

  irMisPrestamos(): void {
    this.router.navigate(['/home/mis-prestamos']);
  }

  irInventario(): void {
    this.router.navigate(['/home/inventario']);
  }
}
