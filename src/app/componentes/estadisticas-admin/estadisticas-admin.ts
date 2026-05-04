import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { HttpErrorResponse } from '@angular/common/http';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { EstadisticaService } from '../../servicios/estadistica';
import { EstadisticaMateriaDTO } from '../../dto/estadistica/estadistica-materia-dto';
import { EstadisticaAsesorDTO } from '../../dto/estadistica/estadistica-asesor-dto';
import { EstadisticaSolicitudDTO } from '../../dto/estadistica/estadistica-solicitud-dto';
import { EstadisticaAsesoriaDTO } from '../../dto/estadistica/estadistica-asesoria-dto';

@Component({
  selector: 'app-estadisticas-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective
  ],
  templateUrl: './estadisticas-admin.html',
  styleUrls: ['./estadisticas-admin.css']
})
export class EstadisticasAdmin implements OnInit {

  graficaSeleccionada:
    'materias' |
    'asesores' |
    'asesoriasEstado' |
    'solicitudesEstado' = 'materias';

  materiasChartData: ChartData<'bar'> = this.crearGraficaBarraVacia('Cantidad');
  asesoresChartData: ChartData<'bar'> = this.crearGraficaBarraVacia('Asesorías');
  asesoriasEstadoChartData: ChartData<'pie'> = this.crearGraficaPieVacia();
  solicitudesEstadoChartData: ChartData<'pie'> = this.crearGraficaPieVacia();

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
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
          size: 15,
          weight: 'bold',
          family: 'DM Sans'
        },
        bodyFont: {
          size: 14,
          family: 'DM Sans'
        }
      }
    },

    scales: {
      x: {
        ticks: {
          color: '#162033',
          font: {
            family: 'DM Sans',
            size: 13,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#5f6b85',
          font: {
            family: 'DM Sans',
            size: 13,
            weight: 'bold'
          }
        },
        grid: {
          color: '#e8eef7'
        }
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,

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
          size: 15,
          weight: 'bold',
          family: 'DM Sans'
        },
        bodyFont: {
          size: 14,
          family: 'DM Sans'
        }
      }
    }
  };

  constructor(
    private estadisticaService: EstadisticaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
    this.cargarAsesores();
    this.cargarAsesoriasEstado();
    this.cargarSolicitudesEstado();
  }

  cargarMaterias(): void {
    this.estadisticaService.materiasMasSolicitadas().subscribe({
      next: (data: any) => {
        const materias: EstadisticaMateriaDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        this.materiasChartData = {
          labels: materias.map(item => item.tema),
          datasets: [
            {
              data: materias.map(item => item.total),
              label: 'Cantidad',
              backgroundColor: [
                '#1A56A0',
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6',
                '#06B6D4'
              ],
              borderRadius: 10,
              borderSkipped: false,
              barThickness: 38
            }
          ]
        };

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar materias:', error);
      }
    });
  }

  cargarAsesores(): void {
    this.estadisticaService.asesoresMasActivos().subscribe({
      next: (data: any) => {
        const asesores: EstadisticaAsesorDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        this.asesoresChartData = {
          labels: asesores.map(item => item.nombre),
          datasets: [
            {
              data: asesores.map(item => item.total),
              label: 'Asesorías',
              backgroundColor: [
                '#6366F1',
                '#22C55E',
                '#F97316',
                '#EC4899',
                '#06B6D4',
                '#1A56A0'
              ],
              borderRadius: 10,
              borderSkipped: false,
              barThickness: 38
            }
          ]
        };

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar asesores:', error);
      }
    });
  }

  cargarAsesoriasEstado(): void {
    this.estadisticaService.asesoriasPorEstado().subscribe({
      next: (data: any) => {
        const asesorias: EstadisticaAsesoriaDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        this.asesoriasEstadoChartData = {
          labels: asesorias.map(item => item.estado),
          datasets: [
            {
              data: asesorias.map(item => item.total),
              backgroundColor: [
                '#1A56A0',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6'
              ],
              borderColor: '#ffffff',
              borderWidth: 3,
              hoverOffset: 10
            }
          ]
        };

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar asesorías:', error);
      }
    });
  }

  cargarSolicitudesEstado(): void {
    this.estadisticaService.solicitudesPorEstado().subscribe({
      next: (data: any) => {
        const solicitudes: EstadisticaSolicitudDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        this.solicitudesEstadoChartData = {
          labels: solicitudes.map(item => item.estado),
          datasets: [
            {
              data: solicitudes.map(item => item.total),
              backgroundColor: [
                '#3B82F6',
                '#22C55E',
                '#F97316',
                '#EC4899',
                '#6366F1'
              ],
              borderColor: '#ffffff',
              borderWidth: 3,
              hoverOffset: 10
            }
          ]
        };

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar solicitudes:', error);
      }
    });
  }

  obtenerTituloGrafica(): string {
    switch (this.graficaSeleccionada) {
      case 'materias':
        return 'Materias más solicitadas';
      case 'asesores':
        return 'Asesores más activos';
      case 'asesoriasEstado':
        return 'Asesorías por estado';
      case 'solicitudesEstado':
        return 'Solicitudes por estado';
      default:
        return 'Estadísticas';
    }
  }

  obtenerDatosGrafica(): ChartData {
    switch (this.graficaSeleccionada) {
      case 'materias':
        return this.materiasChartData;
      case 'asesores':
        return this.asesoresChartData;
      case 'asesoriasEstado':
        return this.asesoriasEstadoChartData;
      case 'solicitudesEstado':
        return this.solicitudesEstadoChartData;
      default:
        return this.materiasChartData;
    }
  }

  obtenerTipoGrafica(): ChartType {
    if (
      this.graficaSeleccionada === 'asesoriasEstado' ||
      this.graficaSeleccionada === 'solicitudesEstado'
    ) {
      return 'pie';
    }

    return 'bar';
  }

  obtenerOpcionesGrafica(): ChartConfiguration['options'] {
    if (
      this.graficaSeleccionada === 'asesoriasEstado' ||
      this.graficaSeleccionada === 'solicitudesEstado'
    ) {
      return this.pieChartOptions;
    }

    return this.chartOptions;
  }

  obtenerResumenDatos(): { nombre: string; total: number }[] {
    const data = this.obtenerDatosGrafica();

    const labels = data.labels ?? [];
    const valores = data.datasets?.[0]?.data ?? [];

    return labels.map((label: any, index: number) => ({
      nombre: String(label),
      total: Number(valores[index] ?? 0)
    }));
  }

  private crearGraficaBarraVacia(label: string): ChartData<'bar'> {
    return {
      labels: [],
      datasets: [
        {
          data: [],
          label,
          backgroundColor: '#1A56A0',
          borderRadius: 10,
          borderSkipped: false
        }
      ]
    };
  }

  private crearGraficaPieVacia(): ChartData<'pie'> {
    return {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#1A56A0',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6'
          ],
          borderColor: '#ffffff',
          borderWidth: 3
        }
      ]
    };
  }

}