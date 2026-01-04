import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../../../../services/Files/files.service';
import { MatDialog } from '@angular/material/dialog';
import { ComprasService } from '../../../../services/Api/compras.service';
import { UsuariosService } from '../../../../services/Api/Usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compras-file-dialog-content',
  imports: [MatIconModule],
  templateUrl: './compras-file-dialog-content.component.html',
  styleUrl: './compras-file-dialog-content.component.css',
})
export class ComprasFileDialogContentComponent {
  fileOptions: any = {};
  usuarioLogueado: any;

  private apiUrl = `${process.env['API_URL']}${process.env['ENDPOINT_IMPORTAR_PDF']}`;

  constructor(
    private _compras: ComprasService,
    private dialog: MatDialog,
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
    var validTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
    ];
    return validTypes.includes(type);
  }

  private dataProcess(file: File) {
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      //logica para archivos .pdf
      this._compras.importarPdf(this.apiUrl, file, Number(this.usuarioLogueado.sub)).subscribe({
        next: (response) => {
          console.log('Importación exitosa:', response);
          this._toastr.success('PDF importado correctamente', 'Éxito');
        },
        error: (error) => {
          console.error('Error al importar PDF:', error);
          this._toastr.error('Error al importar el PDF', 'Error');
        },
      });
    } else {
      console.error('Formato de archivo no soportado');
      this._toastr.error('Formato de archivo no soportado', 'Error');
    }
    this.dialog.closeAll();
  }
}
