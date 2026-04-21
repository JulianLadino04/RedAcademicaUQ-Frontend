import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SolicitudAyudaService } from '../../servicios/solicitud-ayuda';
import { Token } from '../../servicios/token';
import { InformacionSolicitudAyudaDTO } from '../../dto/solicitud/informacion-solicitud-ayuda.dto';
import { EstadoSolicitud } from '../../dto/enums';

@Component({
  selector: 'app-mis-solicitudes-ayuda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-solicitudes-ayuda.html',
  styleUrls: ['./mis-solicitudes-ayuda.css']
})
export class MisSolicitudesAyudaComponent implements OnInit {
  solicitudes: InformacionSolicitudAyudaDTO[] = [];
  cargando = false;
  mensajeError = '';

  constructor(
    private solicitudAyudaService: SolicitudAyudaService,
    private tokenService: Token,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisSolicitudes();
  }

  private obtenerSolicitanteId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    return data?.id || data?._id || data?.userId || null;
  }

  public cargarMisSolicitudes(): void {
    const solicitanteId = this.obtenerSolicitanteId();

    if (!solicitanteId) {
      this.mensajeError = 'No fue posible identificar el usuario autenticado.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.cdr.detectChanges();

    this.solicitudAyudaService.obtenerPorSolicitante(solicitanteId).subscribe({
      next: (resp) => {
        this.solicitudes = Array.isArray(resp?.datos) ? resp.datos : [];
        this.solicitudes.sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar solicitudes:', error);
        this.cargando = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible cargar tus solicitudes.';
        this.cdr.detectChanges();
      }
    });
  }

  public verDetalle(id: string): void {
    this.router.navigate(['/mis-solicitudes-ayuda', id]);
  }

  public formatearTema(tema: string): string {
    return tema.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  public formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  public obtenerClaseEstado(estado: EstadoSolicitud | string): string {
    switch (estado) {
      case EstadoSolicitud.ABIERTA:
      case 'ABIERTA':
        return 'estado estado-abierta';
      case EstadoSolicitud.EN_PROCESO:
      case 'EN_PROCESO':
        return 'estado estado-proceso';
      case EstadoSolicitud.CERRADA:
      case 'CERRADA':
        return 'estado estado-cerrada';
      default:
        return 'estado';
    }
  }
}