import { Component } from '@angular/core';
import { PublicoService } from '../../servicios/publico';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {

  eventos: any[] = [];   // ← declarar la variable

  constructor(private publicoService: PublicoService) {
    this.obtenerEventos();
  }

  public obtenerEventos(){
    this.publicoService.listarEventos(0).subscribe({
      next: (data) => {
        this.eventos = data.respuesta;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

}