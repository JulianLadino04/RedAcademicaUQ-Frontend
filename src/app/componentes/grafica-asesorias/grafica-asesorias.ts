import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { Chart, registerables } from 'chart.js';

import { GraficaEstadoAsesoriaDTO } from '../../dto/estadistica/estadistica-asesoria-asesor-dto';
import { AsesoriaService } from '../../servicios/asesorias';
import { Token } from '../../servicios/token';
import { ResponseDTO } from '../../dto/shared/response.dto';

Chart.register(...registerables);

@Component({
  selector: 'app-grafica-asesorias',
  templateUrl: './grafica-asesorias.html',
  styleUrls: ['./grafica-asesorias.css']
})
export class GraficaAsesorias implements OnInit, AfterViewInit, OnDestroy {

  datos: GraficaEstadoAsesoriaDTO[] = [];
  cargando = true;

  private grafica: Chart | null = null;
  private vistaInicializada = false;

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
    this.vistaInicializada = true;

    if (this.datos.length > 0) {
      this.crearGrafica();
    }
  }

  ngOnDestroy(): void {
    if (this.grafica) {
      this.grafica.destroy();
      this.grafica = null;
    }
  }

  obtenerTotalAsesorias(): number {
    return this.datos.reduce((total, item) => total + Number(item.total), 0);
  }

  private obtenerDatosGrafica(): void {
    const asesorId = this.tokenService.getIDCuenta();

    this.asesoriaService.graficaEstadosPorAsesor(asesorId).subscribe({

      next: (response: ResponseDTO<GraficaEstadoAsesoriaDTO[]>) => {
        this.datos = response.datos ?? [];
        this.cargando = false;

        this.cdRef.detectChanges();

        if (this.datos.length > 0 && this.vistaInicializada) {
          this.crearGrafica();
        }
      },

      error: (error) => {
        console.error('Error al cargar estadísticas del asesor:', error);
        this.datos = [];
        this.cargando = false;
        this.cdRef.detectChanges();
      }

    });
  }

  private crearGrafica(): void {
    if (!this.canvas?.nativeElement) {
      return;
    }

    const ctx = this.canvas.nativeElement;

    const labels = this.datos.map(item => item.estado);
    const valores = this.datos.map(item => item.total);

    if (this.grafica) {
      this.grafica.destroy();
    }

    this.grafica = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
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
            ],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: '62%',

        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#162033',
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                family: 'DM Sans',
                size: 13,
                weight: 'bold'
              }
            }
          },

          tooltip: {
            enabled: true,
            backgroundColor: '#ffffff',
            titleColor: '#162033',
            bodyColor: '#5f6b85',
            borderColor: '#e3ebf5',
            borderWidth: 1,
            padding: 14,
            titleFont: {
              family: 'DM Sans',
              size: 15,
              weight: 'bold'
            },
            bodyFont: {
              family: 'DM Sans',
              size: 14
            }
          }
        }
      }
    });
  }

}