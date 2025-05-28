import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReservaLaboratorioComponent } from "./components/home/reserva-laboratorio/reserva-laboratorio.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ERP-CIDIL-FRONT';
}
