import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../../../../../services/Files/files.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-file-dialog-content',
  imports: [MatIconModule],
  templateUrl: './file-dialog-content.component.html',
  styleUrl: './file-dialog-content.component.css',
  providers: [FilesService]
})
export class FileDialogContentComponent {

  fileOptions: any = {};

  constructor(private _fileService: FilesService, private dialog: MatDialog) { }

  selectFile() {
    const input: any = document.querySelector('.file-selector-input') as HTMLInputElement;
    input.click();

    input.onchange = () => {
      [...input.files].forEach((file: any) => {
        if (this.typeValidation(file.type)) {
          //logica
          this.dataProcess(file);
        }
      });
    }

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
    if (fileName.endsWith('.csv')) {
      //logica para archivos .csv
      this._fileService.procesarCSV(file);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      //logica para archivos .xls o .xlsx
      this._fileService.procesarExcel(file);
    } else {
      console.error('Formato de archivo no soportado');
    }
  }
}
