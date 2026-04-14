import { Component } from '@angular/core';
import { EventoDTO } from '../../dto/eventos/evento.dto';
import { ActivatedRoute } from '@angular/router';
import { Eventos } from '../../servicios/eventos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-evento.html',
  styleUrl: './detalle-evento.css'
})
export class DetalleEvento {

  codigoEvento: string = '';
  evento: EventoDTO | undefined;

  constructor(private route: ActivatedRoute, private eventosService: Eventos) {
    this.route.params.subscribe((params) => {
      this.codigoEvento = params['id'];
      this.obtenerEvento();
    });
  }

  public obtenerEvento() {
    const eventoConsultado = this.eventosService.obtener(this.codigoEvento);
    if (eventoConsultado != undefined) {
      this.evento = eventoConsultado;
    }
  }

}