import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { GraficaEstadoAsesoriaDTO } from '../../dto/estadistica/estadistica-asesoria-asesor-dto';
import { AsesoriaService } from '../../servicios/asesorias';
import { Token } from '../../servicios/token';
import { ResponseDTO } from '../../dto/shared/response.dto';

Chart.register(...registerables);

@Component({
  selector: 'app-grafica-asesorias',
  templateUrl: './grafica-asesorias.html',
  styleUrl: './grafica-asesorias.css'
})
export class GraficaAsesorias implements OnInit, AfterViewInit {

  datos: GraficaEstadoAsesoriaDTO[] = [];
  cargando = true;

  private grafica: Chart | null = null;

  @ViewChild('graficaEstados') canvas?: ElementRef<HTMLCanvasElement>;

  constructor(
    private asesoriaService: AsesoriaService,
    private tokenService: Token,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerDatosGrafica();
  }

  ngAfterViewInit(): void {
    // Angular ya renderizó el DOM
  }

  private obtenerDatosGrafica(): void {

    const asesorId = this.tokenService.getIDCuenta();
    console.log("ID asesor:", asesorId);

    this.asesoriaService.graficaEstadosPorAsesor(asesorId)
      .subscribe({

        next: (response: ResponseDTO<GraficaEstadoAsesoriaDTO[]>) => {

          console.log("Respuesta backend:", response);

          this.datos = response.datos ?? [];
          this.cargando = false;

          // Forzar render del DOM
          this.cdRef.detectChanges();

          if (this.datos.length > 0) {
            this.crearGrafica();
          }

        },

        error: (error) => {
          console.error("Error backend:", error);
          this.cargando = false;
        }

      });
  }

  private crearGrafica(): void {

    if (!this.canvas?.nativeElement) {
      console.error("Canvas no encontrado");
      return;
    }

    const ctx = this.canvas.nativeElement;

    const labels = this.datos.map(d => d.estado);
    const valores = this.datos.map(d => d.total);

    if (this.grafica) {
      this.grafica.destroy();
    }

    this.grafica = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: valores,
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
              '#06B6D4'
        ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

  }

}