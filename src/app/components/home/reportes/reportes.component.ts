import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReporteFallaService } from '../../../services/Api/ReporteFalla/reporteFalla.service';
import { ReporteFalla } from '../../../interfaces/reporteFalla.interface';
import { UsuariosService } from '../../../services/Api/Usuarios/usuarios.service';
import { AppCualRolDirective } from '../../../directives/app-cual-rol.directive';

@Component({
  selector: 'app-reporte-falla',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, AppCualRolDirective],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  /** Límite de caracteres para la descripción, usado también en el template */
  readonly descripcionMaxLength = 400;

  private fb = inject(FormBuilder);

  usuarioLogueado!: any;
  loading: boolean = false;

  reporteForm = this.fb.nonNullable.group({
    categoria: ['Infraestructura', Validators.required],
    lugar: ['', Validators.required],
    descripcion: [
      '',
      [Validators.required, Validators.maxLength(this.descripcionMaxLength)],
    ],
  });

  constructor(
    private _toastr: ToastrService,
    private _reportes: ReporteFallaService,
    private _usuario: UsuariosService,
  ) {}

  ngOnInit(): void {
    this._usuario.user$.subscribe((usuario) => {
      if (usuario) {
        this.usuarioLogueado = usuario;
      }
    });
  }

  enviarReporte(): void {
    this.loading = true;

    if (this.reporteForm.invalid) {
      this.reporteForm.markAllAsTouched();
      return;
    }

    const form = this.reporteForm.value;

    const data: any = {
      descripcion: form.descripcion,
      lugar: form.lugar,
      idUsuario: Number(this.usuarioLogueado.sub),
      categoria: form.categoria,
    };

    this._reportes.crearReporte(data).subscribe({
      next: (respose: any) => {
        this.loading = false;
        this._toastr.success(
          'Le avisaremos cuando cambie de estado. Puedes seguirlo en mis Reportes',
          'Reporte enviado correctamente',
        );
      },
      error: (err) => {
        this.loading = false;
        this._toastr.error('Hubo un error al crear su reporte.', 'Error');
      },
    });

    this.reporteForm.reset({
      categoria: 'Infraestructura',
      lugar: '',
      descripcion: '',
    });
  }
}
