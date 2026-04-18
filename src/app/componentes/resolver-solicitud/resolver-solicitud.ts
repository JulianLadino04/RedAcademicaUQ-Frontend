import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente para listar solicitudes de ayuda
 * Lista deslizable horizontal
 * Muestra: tema, urgencia, solicitanteNombre, descripcion, fecha
 * Usuario selecciona una y presiona Resolver
 */
@Component({
  selector: 'app-resolver-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resolver-solicitud.html',
  styleUrls: ['./resolver-solicitud.css']
})
export class ResolverSolicitudComponent implements OnInit {
  solicitudes: any[] = [];
  cargando = false;
  solicitudSeleccionada: string | null = null;

  // ✅ DATOS MOCK
  solicitudesMock = [
    {
      id: 'SOL-001',
      tema: 'MATEMÁTICA',
      urgencia: 3,
      solicitanteId: 'EST-101',
      solicitanteNombre: 'Carlos García',
      descripcion: 'Necesito ayuda con ecuaciones de segundo grado',
      fechaSolicitud: new Date('2024-04-18')
    },
    {
      id: 'SOL-002',
      tema: 'LENGUAJE',
      urgencia: 5,
      solicitanteId: 'EST-102',
      solicitanteNombre: 'María López',
      descripcion: 'Ayuda urgente con análisis de textos literarios',
      fechaSolicitud: new Date('2024-04-18')
    },
    {
      id: 'SOL-003',
      tema: 'PROGRAMACIÓN',
      urgencia: 2,
      solicitanteId: 'EST-103',
      solicitanteNombre: 'Juan Pérez',
      descripcion: 'Consulta sobre estructuras de datos en JavaScript',
      fechaSolicitud: new Date('2024-04-17')
    },
    {
      id: 'SOL-004',
      tema: 'INGLÉS',
      urgencia: 4,
      solicitanteId: 'EST-104',
      solicitanteNombre: 'Ana Martínez',
      descripcion: 'Necesito mejorar mi pronunciación en inglés',
      fechaSolicitud: new Date('2024-04-17')
    },
    {
      id: 'SOL-005',
      tema: 'CIENCIAS',
      urgencia: 1,
      solicitanteId: 'EST-105',
      solicitanteNombre: 'Pedro Rodríguez',
      descripcion: 'Duda sobre el ciclo del agua en la naturaleza',
      fechaSolicitud: new Date('2024-04-16')
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarSolicitudes();
  }

  private cargarSolicitudes() {
    this.cargando = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.solicitudes = [...this.solicitudesMock];
      this.cargando = false;
      this.cdr.detectChanges();
    }, 500);
  }

  public seleccionar(solicitudId: string) {
    this.solicitudSeleccionada = this.solicitudSeleccionada === solicitudId ? null : solicitudId;
  }

  public resolver() {
    if (!this.solicitudSeleccionada) return;
    
    console.log('Resolviendo solicitud:', this.solicitudSeleccionada);
    this.router.navigate(['/resolver-solicitud', this.solicitudSeleccionada]);
  }

  public getColorUrgencia(urgencia: number): string {
    if (urgencia >= 4) return 'urgencia-alta';
    if (urgencia >= 2) return 'urgencia-media';
    return 'urgencia-baja';
  }

  public getIconoUrgencia(urgencia: number): string {
    if (urgencia >= 4) return 'fa-exclamation-circle';
    if (urgencia >= 2) return 'fa-exclamation-triangle';
    return 'fa-info-circle';
  }

  public formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  public estaSeleccionada(solicitudId: string): boolean {
    return this.solicitudSeleccionada === solicitudId;
  }
}