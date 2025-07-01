import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventarioService } from '../../../services/Inventario/inventario.service';
import { Carta } from '../../../interfaces/carta';

@Component({
  selector: 'app-crear-equipo',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './crear-equipo.component.html',
  styleUrl: './crear-equipo.component.css'
})
export class CrearEquipoComponent {

 solicitudesForm!: FormGroup;
 inventario: Carta[] = [];

 constructor(private fb: FormBuilder, private toastr: ToastrService, private inventarioService: InventarioService)
 {
  this.solicitudesForm = new FormGroup({
  nombre: new FormControl('', [Validators.required]),
  nombreCorto: new FormControl('', [Validators.required]),
  perfil: new FormControl('', [Validators.required]),
  idLaboratorio: new FormControl('', [Validators.required]),
  fabricante: new FormControl('', [Validators.required]),
  modelo: new FormControl('', [Validators.required]),
  serial: new FormControl('', [Validators.required]),
  descripcionLarga: new FormControl('', [Validators.required]),
  fechaTransaccion: new FormControl('', [Validators.required]),
  departamento: new FormControl('', [Validators.required]),
  importeActivo: new FormControl(0, [Validators.required]),
  imagenEquipo: new FormControl('', [Validators.required]),
  disponible: new FormControl(true),
  idEstadoFisico: new FormControl('', [Validators.required]),
  validacionPrestamo: new FormControl(true),
  cantidad: new FormControl(1, [Validators.required, Validators.min(1)])
  })
 }

ngOnInit(): void {

}

crearEquipo(): void {

  
    if (this.solicitudesForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    const nuevoEquipo: Carta = this.solicitudesForm.value;
    console.log(nuevoEquipo)
    this.inventarioService.agregarCarta(nuevoEquipo).subscribe({
      next: () => {
        this.toastr.success('Equipo creado correctamente.');
        this.solicitudesForm.reset();
        this.solicitudesForm.patchValue({ disponible: true, validacionPrestamo: true, importeActivo: 1, cantidad: 1 });
        console.log(nuevoEquipo)
      },
      error: (err) => {
        console.error('Error al crear el equipo:', err);
        this.toastr.error('Error al crear el equipo.');
      }
    });
  }




}
