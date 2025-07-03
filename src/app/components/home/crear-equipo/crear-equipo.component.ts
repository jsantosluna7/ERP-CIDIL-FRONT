import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventarioService } from '../../../services/Inventario/inventario.service';
import { Carta } from '../../../interfaces/carta';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-equipo',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './crear-equipo.component.html',
  styleUrl: './crear-equipo.component.css'
})
export class CrearEquipoComponent {

 solicitudesForm!: FormGroup;
 inventario: Carta[] = [];

 constructor(private fb: FormBuilder, private toastr: ToastrService, private inventarioService: InventarioService, private http: HttpClient)
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
  departamento: new FormControl('', [Validators.required]),
  importeActivo: new FormControl(0, [Validators.required]),
  imagenEquipo: new FormControl(''),
  disponible: new FormControl(true),
  idEstadoFisico: new FormControl('', [Validators.required]),
  validacionPrestamo: new FormControl(true),
  cantidad: new FormControl(1, [Validators.required, Validators.min(1)])
  })
 }

ngOnInit(): void {

}




crearEquipo(): void {
  const formValue = this.solicitudesForm.value;
  let formularioValido = true;

  if (!formValue.nombre) {
    console.error(' Campo "nombre" está vacío');
    formularioValido = false;
  }

  if (!formValue.nombreCorto) {
    console.error('Campo "nombreCorto" está vacío');
    formularioValido = false;
  }

  if (!formValue.perfil) {
    console.error('Campo "perfil" está vacío');
    formularioValido = false;
  }

  if (!formValue.departamento) {
    console.error(' Campo "departamento" está vacío');
    formularioValido = false;
  }

  if (!formValue.fabricante) {
    console.error(' Campo "fabricante" está vacío');
    formularioValido = false;
  }

  if (!formValue.modelo) {
    console.error(' Campo "modelo" está vacío');
    formularioValido = false;
  }

  if (!formValue.serial) {
    console.error('Campo "serial" está vacío');
    formularioValido = false;
  }

  if (!formValue.descripcionLarga) {
    console.error(' Campo "descripcionLarga" está vacío');
    formularioValido = false;
  }


  if (!formValue.idLaboratorio) {
    console.error(' Campo "idLaboratorio" está vacío');
    formularioValido = false;
  }

  if (!formValue.idEstadoFisico) {
    console.error(' Campo "idEstadoFisico" está vacío');
    formularioValido = false;
  }

  if (formValue.importeActivo <= 0) {
    console.error(' El importeActivo debe ser mayor que cero');
    formularioValido = false;
  }

  if (formValue.cantidad <= 0) {
    console.error(' La cantidad debe ser mayor que cero');
    formularioValido = false;
  }

  if (!formularioValido) {
    this.toastr.error('Hay campos incompletos o inválidos. Verifica la consola.');
    return;
  }

  // Imagen por defecto si no hay
  if (!formValue.imagenEquipo) {
    formValue.imagenEquipo = '/public/Imagenes/Imagen de WhatsApp 2025-06-03 a las 14.17.00_691d2cbd.jpg';
  }

  const nuevoEquipo: Carta = formValue;

  this.inventarioService.agregarCarta(nuevoEquipo).subscribe({
    next: () => {
      this.toastr.success('Equipo creado correctamente.');
      this.solicitudesForm.reset();
      this.solicitudesForm.patchValue({
        disponible: true,
        validacionPrestamo: true,
        importeActivo: 1,
        cantidad: 1
      });
      console.log(nuevoEquipo);
    },
    error: (err) => {
      console.error('Error al crear el equipo:', err);
      console.log(nuevoEquipo)
      this.toastr.error('Error al crear el equipo.');
    }
  });
}


/*crearEquipo(): void {

  
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
  } */



  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const formData = new FormData();
      formData.append('archivo', input.files[0]);

      this.http
        .post<string>(
          'http://100.89.68.57:5000/api/InventarioEquipo/subir-imagen',
          formData
        )
        .subscribe({
          next: (rutaFoto: any) => {
            console.log(rutaFoto.ruta);
            this.solicitudesForm.get('imagenEquipo')?.setValue(rutaFoto.ruta);
          },
          error: (err) => console.error('Error al subir imagen:',err),
        });
    }
  }




}
