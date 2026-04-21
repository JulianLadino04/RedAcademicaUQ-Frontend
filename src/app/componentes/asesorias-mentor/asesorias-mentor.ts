import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AsesoriaService } from '../../servicios/asesorias';
import { InformacionAsesoriaDTO } from '../../dto/asesoria/informacion-asesoria.dto';
import { EstadoAsesoria } from '../../dto/enums';
import { Token } from '../../servicios/token';
@Component({
  selector: 'app-asesorias-mentor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asesorias-mentor.html',
  styleUrls: ['./asesorias-mentor.css']
})
export class AsesoriasMentorComponent implements OnInit {

  asesorias: InformacionAsesoriaDTO[] = [];
  asesoriasFiltradas: InformacionAsesoriaDTO[] = [];

  cargando = false;
  procesandoEstado = false;
  mensajeError = '';
  mensajeExito = '';

  filtroEstado: 'TODAS' | EstadoAsesoria = 'TODAS';

  readonly EstadoAsesoria = EstadoAsesoria;

  constructor(
    private asesoriaService: AsesoriaService,
    private tokenService: Token,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAsesoriasMentor();
  }

  private obtenerMentorId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    console.log('🔐 Token decodificado mentor:', data);

    return data?.id || data?._id || data?.userId || null;
  }

  public cargarAsesoriasMentor(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const mentorId = this.obtenerMentorId();

    if (!mentorId) {
      this.cargando = false;
      this.mensajeError = 'No fue posible identificar el mentor autenticado.';
      this.cdr.detectChanges();
      return;
    }

    this.asesoriaService.obtenerPorAsesor(mentorId)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta) => {
          console.log('📥 Asesorías del mentor:', respuesta);

          const lista = Array.isArray(respuesta?.datos) ? respuesta.datos : [];

          this.asesorias = lista.sort((a, b) => {
            const fechaA = new Date(a.fechaHora).getTime();
            const fechaB = new Date(b.fechaHora).getTime();
            return fechaB - fechaA;
          });

          this.aplicarFiltro();
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error al cargar asesorías del mentor:', error);
          this.mensajeError =
            error.error?.mensaje ||
            'No fue posible cargar las asesorías del mentor.';
        }
      });
  }

  public aplicarFiltro(): void {
    if (this.filtroEstado === 'TODAS') {
      this.asesoriasFiltradas = [...this.asesorias];
      return;
    }

    this.asesoriasFiltradas = this.asesorias.filter(
      a => a.estado === this.filtroEstado
    );
  }

  public cambiarFiltro(estado: 'TODAS' | EstadoAsesoria): void {
    this.filtroEstado = estado;
    this.aplicarFiltro();
  }

  public actualizarEstado(asesoria: InformacionAsesoriaDTO, estado: EstadoAsesoria): void {
    this.procesandoEstado = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.asesoriaService.actualizarEstado(asesoria.id, estado)
      .pipe(
        finalize(() => {
          this.procesandoEstado = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (respuesta) => {
          asesoria.estado = estado;
          this.aplicarFiltro();
          this.mensajeExito = respuesta?.mensaje || 'Estado actualizado correctamente.';
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error al actualizar estado:', error);
          this.mensajeError =
            error.error?.mensaje ||
            'No fue posible actualizar el estado de la asesoría.';
        }
      });
  }

  public puedeAceptar(estado: EstadoAsesoria | string): boolean {
    return estado === EstadoAsesoria.PENDIENTE;
  }

  public puedeRechazar(estado: EstadoAsesoria | string): boolean {
    return estado === EstadoAsesoria.PENDIENTE;
  }

  public puedeFinalizar(estado: EstadoAsesoria | string): boolean {
    return estado === EstadoAsesoria.ACEPTADA;
  }

  public formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';

    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
      return fecha;
    }

    return fechaObj.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public obtenerTextoEstado(estado: EstadoAsesoria | string): string {
    switch (estado) {
      case EstadoAsesoria.PENDIENTE:
      case 'PENDIENTE':
        return 'Pendiente';
      case EstadoAsesoria.ACEPTADA:
      case 'ACEPTADA':
        return 'Aceptada';
      case EstadoAsesoria.RECHAZADA:
      case 'RECHAZADA':
        return 'Rechazada';
      case EstadoAsesoria.FINALIZADA:
      case 'FINALIZADA':
        return 'Finalizada';
      case EstadoAsesoria.CANCELADA:
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return 'Sin estado';
    }
  }

  public obtenerClaseEstado(estado: EstadoAsesoria | string): string {
    switch (estado) {
      case EstadoAsesoria.PENDIENTE:
      case 'PENDIENTE':
        return 'estado estado-pendiente';
      case EstadoAsesoria.ACEPTADA:
      case 'ACEPTADA':
        return 'estado estado-aceptada';
      case EstadoAsesoria.RECHAZADA:
      case 'RECHAZADA':
        return 'estado estado-rechazada';
      case EstadoAsesoria.FINALIZADA:
      case 'FINALIZADA':
        return 'estado estado-finalizada';
      case EstadoAsesoria.CANCELADA:
      case 'CANCELADA':
        return 'estado estado-cancelada';
      default:
        return 'estado';
    }
  }

  public trackByAsesoria(index: number, asesoria: InformacionAsesoriaDTO): string {
    return asesoria.id;
  }
}