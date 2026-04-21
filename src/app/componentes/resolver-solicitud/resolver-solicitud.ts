import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SolicitudAyudaService, AtenderSolicitudDTO } from '../../servicios/solicitud-ayuda';
import { InformacionSolicitudAyudaDTO } from '../../dto/solicitud/informacion-solicitud-ayuda.dto';
import { Token } from '../../servicios/token';
import { EstadoSolicitud } from '../../dto/enums';

@Component({
  selector: 'app-resolver-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resolver-solicitud.html',
  styleUrls: ['./resolver-solicitud.css']
})
export class ResolverSolicitudComponent implements OnInit {
  solicitudes: InformacionSolicitudAyudaDTO[] = [];
  cargando = false;
  procesando = false;
  solicitudSeleccionada: string | null = null;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private solicitudAyudaService: SolicitudAyudaService,
    private tokenService: Token
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  private cargarSolicitudes(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    this.solicitudAyudaService.obtenerActivas().subscribe({
      next: (resp) => {
        console.log('📥 RESPUESTA COMPLETA:', resp);
        console.log('📦 ARRAY DATOS:', resp?.datos);
        console.log('📌 ¿Es array?', Array.isArray(resp?.datos));

        this.solicitudes = Array.isArray(resp?.datos) ? resp.datos : [];

        console.log('✅ SOLICITUDES CARGADAS EN EL COMPONENTE:', this.solicitudes);

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
          'No fue posible cargar las solicitudes.';
        this.cdr.detectChanges();
      }
    });
  }

  private obtenerMentorId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    console.log('🔐 Token decodificado:', data);
    return data?.id || data?._id || data?.userId || null;
  }

  public seleccionar(solicitudId: string): void {
    if (this.procesando) return;
    this.solicitudSeleccionada = this.solicitudSeleccionada === solicitudId ? null : solicitudId;
  }

  public resolver(): void {
    if (!this.solicitudSeleccionada) return;

    const mentorId = this.obtenerMentorId();

    if (!mentorId) {
      this.mensajeError = 'No fue posible identificar el mentor autenticado.';
      return;
    }

    this.procesando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const dto: AtenderSolicitudDTO = {
      solicitudId: this.solicitudSeleccionada,
      mentorId
    };

    console.log('📤 DTO ATENDER SOLICITUD:', dto);

    this.solicitudAyudaService.atenderSolicitud(dto).subscribe({
      next: (resp) => {
        console.log('✅ RESPUESTA ATENDER SOLICITUD:', resp);

        this.mensajeExito = resp.mensaje || 'Solicitud tomada correctamente.';
        const id = this.solicitudSeleccionada;

        this.procesando = false;
        this.solicitudSeleccionada = null;
        this.cdr.detectChanges();

        this.router.navigate(['/resolver-solicitud', id]);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al atender solicitud:', error);
        this.procesando = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible tomar la solicitud.';
        this.cdr.detectChanges();
      }
    });
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

  public formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  public formatearTema(tema: string): string {
    return tema
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
  }

  public estaSeleccionada(solicitudId: string): boolean {
    return this.solicitudSeleccionada === solicitudId;
  }
}