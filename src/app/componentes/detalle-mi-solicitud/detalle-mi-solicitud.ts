import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SolicitudAyudaService } from '../../servicios/solicitud-ayuda';
import { RespuestaSolicitudService } from '../../servicios/respuesta-solicitud';
import { ContenidosAcademicosService } from '../../servicios/contenido-academico';
import { Token } from '../../servicios/token';

import { InformacionSolicitudAyudaDTO } from '../../dto/solicitud/informacion-solicitud-ayuda.dto';
import { EstadoSolicitud } from '../../dto/enums';
import { InformacionRespuestaSolicitudDTO } from '../../dto/solicitud/informacion-respuesta-solicitud';

@Component({
  selector: 'app-detalle-mi-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-mi-solicitud.html',
  styleUrls: ['./detalle-mi-solicitud.css']
})
export class DetalleMiSolicitudComponent implements OnInit {
  solicitudId = '';
  solicitud: InformacionSolicitudAyudaDTO | null = null;
  respuestas: InformacionRespuestaSolicitudDTO[] = [];

  cargando = false;
  cerrando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private route: ActivatedRoute,
    private solicitudAyudaService: SolicitudAyudaService,
    private respuestaSolicitudService: RespuestaSolicitudService,
    private contenidoAcademicoService: ContenidosAcademicosService,
    private tokenService: Token,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.mensajeError = 'No se recibió el ID de la solicitud.';
        return;
      }

      this.solicitudId = id;
      this.cargarDetalle();
    });
  }

  private obtenerSolicitanteId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    return data?.id || data?._id || data?.userId || null;
  }

  private cargarDetalle(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    this.solicitudAyudaService.obtenerTodas().subscribe({
      next: (resp) => {
        const lista = Array.isArray(resp?.datos) ? resp.datos : [];
        this.solicitud = lista.find(s => s.id === this.solicitudId) || null;

        if (!this.solicitud) {
          this.cargando = false;
          this.mensajeError = 'No se encontró la solicitud.';
          this.cdr.detectChanges();
          return;
        }

        this.respuestaSolicitudService.obtenerPorSolicitud(this.solicitudId).subscribe({
          next: (r) => {
            this.respuestas = Array.isArray(r?.datos) ? r.datos : [];
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error: HttpErrorResponse) => {
            console.error('❌ Error al cargar respuestas:', error);
            this.respuestas = [];
            this.cargando = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar solicitud:', error);
        this.cargando = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible cargar la solicitud.';
        this.cdr.detectChanges();
      }
    });
  }

  public cerrarSolicitud(): void {
    const solicitanteId = this.obtenerSolicitanteId();

    if (!solicitanteId || !this.solicitud) {
      this.mensajeError = 'No fue posible cerrar la solicitud.';
      return;
    }

    this.cerrando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.solicitudAyudaService.cerrarSolicitud({
      solicitudId: this.solicitud.id,
      solicitanteId
    }).subscribe({
      next: (resp) => {
        this.mensajeExito = resp.mensaje || 'Solicitud cerrada correctamente.';
        if (this.solicitud) {
          this.solicitud.estado = EstadoSolicitud.CERRADA;
        }
        this.cerrando = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cerrar solicitud:', error);
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible cerrar la solicitud.';
        this.cerrando = false;
        this.cdr.detectChanges();
      }
    });
  }

  public abrirAdjunto(archivoId: string): void {
    if (!archivoId) return;

    this.respuestaSolicitudService.descargarAdjunto(archivoId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error('❌ Error al abrir adjunto:', error);
        this.mensajeError = 'No fue posible abrir el archivo adjunto.';
        this.cdr.detectChanges();
      }
    });
  }

  public abrirContenidoRelacionado(contenidoId: string): void {
    if (!contenidoId) return;

    this.contenidoAcademicoService.descargarArchivo(contenidoId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error('❌ Error al abrir contenido relacionado:', error);
        this.mensajeError = 'No fue posible abrir el contenido relacionado.';
        this.cdr.detectChanges();
      }
    });
  }

  public formatearTema(tema: string): string {
    return tema.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  public formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public obtenerTextoEstado(estado: EstadoSolicitud | string): string {
    switch (estado) {
      case EstadoSolicitud.ABIERTA:
      case 'ABIERTA':
        return 'Abierta';
      case EstadoSolicitud.EN_PROCESO:
      case 'EN_PROCESO':
        return 'En proceso';
      case EstadoSolicitud.CERRADA:
      case 'CERRADA':
        return 'Cerrada';
      default:
        return 'Sin estado';
    }
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

  public puedeCerrar(): boolean {
    return !!this.solicitud && this.solicitud.estado !== EstadoSolicitud.CERRADA;
  }
}