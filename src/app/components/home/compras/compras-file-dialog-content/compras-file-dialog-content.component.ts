import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../../../../services/Files/files.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComprasService } from '../../../../services/Api/compras.service';
import { UsuariosService } from '../../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ComprasFileDialogComponent } from '../compras-file-dialog/compras-file-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-compras-file-dialog-content',
  imports: [MatIconModule, MatProgressSpinnerModule],
  templateUrl: './compras-file-dialog-content.component.html',
  styleUrl: './compras-file-dialog-content.component.css',
})
export class ComprasFileDialogContentComponent {
  fileOptions: any = {};
  usuarioLogueado: any;
  loading = false;

  dialogPadre = inject(MatDialogRef<ComprasFileDialogComponent>);

  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_IMPORTAR_PDF']}`;

  constructor(
    private _compras: ComprasService,
    private _usuarios: UsuariosService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._usuarios.user$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
  }

  selectFile() {
    const input: any = document.querySelector(
      '.file-selector-input'
    ) as HTMLInputElement;
    input.click();

    input.onchange = () => {
      [...input.files].forEach((file: any) => {
        if (this.typeValidation(file.type)) {
          //logica
          this.dataProcess(file);
        }
      });
    };
  }

  dragover(event: DragEvent) {
    event.preventDefault();
    const transfer: any = event.dataTransfer;
    [...transfer.items].forEach((item: any) => {
      if (this.typeValidation(item.type)) {
        const target: any = event.currentTarget;
        target.classList.add('drag-over-effect');
      }
    });
  }

  dragleave(event: DragEvent) {
    // event.preventDefault();
    const target: any = event.currentTarget;
    target.classList.remove('drag-over-effect');
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const target: any = event.currentTarget;
    target.classList.remove('drag-over-effect');

    const transfer: any = event.dataTransfer;
    if (transfer.items) {
      [...transfer.items].forEach((item: any) => {
        if (this.typeValidation(item.type)) {
          const file = item.getAsFile();
          if (this.typeValidation(file.type)) {
            //logica
            this.dataProcess(file);
          }
        }
      });
    } else {
      [...transfer.files].forEach((file: any) => {
        if (this.typeValidation(file.type)) {
          //logica
          this.dataProcess(file);
        }
      });
    }
  }

  typeValidation(type: any): boolean {
    const validTypes = ['application/pdf'];
    return validTypes.includes(type);
  }

  private dataProcess(file: File) {
    this.loading = true;
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      //logica para archivos .pdf
      this._compras
        .importarPdf(this.apiUrl, file, Number(this.usuarioLogueado.sub))
        .subscribe({
          next: (response) => {
            console.log(response)
            this._toastr.success('PDF importado correctamente', 'Éxito');
            this.dialogPadre.close({
              success: true,
              data: response,
            });
            this.loading = false;
          },
          error: (error) => {
            this._toastr.error('Error al importar el PDF', 'Error');
            this.dialogPadre.close();
            this.loading = false;
          },
        });
    } else {
      console.error('Formato de archivo no soportado');
      this._toastr.error('Formato de archivo no soportado', 'Error');
      this.dialogPadre.close();
      this.loading = false;
    }
  }
}
