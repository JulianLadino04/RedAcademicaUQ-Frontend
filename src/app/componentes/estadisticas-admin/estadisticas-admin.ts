import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EstadisticaService } from '../../servicios/estadistica';
import { BaseChartDirective } from 'ng2-charts';
import { HttpErrorResponse } from '@angular/common/http';
import { EstadisticaMateriaDTO } from '../../dto/estadistica/estadistica-materia-dto';
import { EstadisticaAsesorDTO } from '../../dto/estadistica/estadistica-asesor-dto';
import { EstadisticaSolicitudDTO } from '../../dto/estadistica/estadistica-solicitud-dto';
import { EstadisticaAsesoriaDTO } from '../../dto/estadistica/estadistica-asesoria-dto';

@Component({
  selector: 'app-estadisticas-admin',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './estadisticas-admin.html',
  styleUrls: ['./estadisticas-admin.css']
})
export class EstadisticasAdmin implements OnInit {

  materiasChartData: any;
  asesoresChartData: any;
  asesoriasEstadoChartData: any;
  solicitudesEstadoChartData: any;

 chartOptions: any = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: 'DM Sans',
          size: 13,
          weight: 700
        },
        color: '#162033'
      }
    },
    y: {
      ticks: {
        font: {
          family: 'DM Sans',
          size: 13,
          weight: 700
        },
        color: '#162033'
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

  cargarMaterias() {

    this.estadisticaService.materiasMasSolicitadas().subscribe({

      next: (data: any) => {

        console.log('📊 Materias más solicitadas:', data);

        const materias: EstadisticaMateriaDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        const labels = materias.map(d => d.tema);
        const valores = materias.map(d => d.total);

        this.materiasChartData = {
          labels: labels,
          datasets: [
            {
              data: valores,
              label: 'Cantidad',
              backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
              '#06B6D4'
            ],
            borderRadius: 6
            }
          ]
        };

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar materias:', error);
      }

    });

  }

  cargarAsesores() {

    this.estadisticaService.asesoresMasActivos().subscribe({

      next: (data: any) => {

        console.log('📊 Asesores más activos:', data);

        const asesores: EstadisticaAsesorDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        const labels = asesores.map(d => d.nombre);
        const valores = asesores.map(d => d.total);

        this.asesoresChartData = {
          labels: labels,
          datasets: [
            {
              data: valores,
              label: 'Asesorías',
              backgroundColor: [
                '#6366F1',
                '#22C55E',
                '#F97316',
                '#EC4899',
                '#06B6D4'
              ],
              borderRadius: 6
            }
          ]
        };

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar asesores:', error);
      }

    });

  }

  cargarAsesoriasEstado() {

    this.estadisticaService.asesoriasPorEstado().subscribe({

      next: (data: any) => {

        console.log('📊 Asesorías por estado:', data);

        const asesorias: EstadisticaAsesoriaDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        const labels = asesorias.map(d => d.estado);
        const valores = asesorias.map(d => d.total);

        this.asesoriasEstadoChartData = {
          labels: labels,
          datasets: [
            {
              data: valores
            }
          ]
        };

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar asesorías:', error);
      }

    });

  }

  cargarSolicitudesEstado() {

    this.estadisticaService.solicitudesPorEstado().subscribe({

      next: (data: any) => {

        console.log('📊 Solicitudes por estado:', data);

        const solicitudes: EstadisticaSolicitudDTO[] =
          Array.isArray(data?.datos) ? [...data.datos] : [];

        const labels = solicitudes.map(d => d.estado);
        const valores = solicitudes.map(d => d.total);

        this.solicitudesEstadoChartData = {
          labels: labels,
          datasets: [
            {
              data: valores
            }
          ]
        };

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar solicitudes:', error);
      }

    });

  }

}