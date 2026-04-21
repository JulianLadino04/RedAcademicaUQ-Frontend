import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AsesoriaService } from '../../servicios/asesorias';
import { InformacionAsesoriaDTO } from '../../dto/asesoria/informacion-asesoria.dto';
import { Token } from '../../servicios/token';
import { EstadoAsesoria } from '../../dto/enums';

@Component({
  selector: 'app-mis-asesorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-asesorias.html',
  styleUrls: ['./mis-asesorias.css']
})
export class MisAsesoriasComponent implements OnInit {

  asesorias: InformacionAsesoriaDTO[] = [];
  cargando = false;
  mensajeError = '';

  constructor(
    private asesoriaService: AsesoriaService,
    private tokenService: Token,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisAsesorias();
  }

  private obtenerSolicitanteId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    console.log('🔐 Token decodificado:', data);
    return data?.id || data?._id || data?.userId || data?.sub || null;
  }

  public cargarMisAsesorias(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.asesorias = [];

    const solicitanteId = this.obtenerSolicitanteId();

    if (!solicitanteId) {
      this.cargando = false;
      this.mensajeError = 'No fue posible identificar el usuario autenticado.';
      this.cdr.detectChanges();
      return;
    }

    this.asesoriaService.obtenerPorSolicitante(solicitanteId)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
          console.log('✅ Finalizó carga. cargando =', this.cargando);
        })
      )
      .subscribe({
        next: (respuesta: any) => {
          try {
            console.log('📥 Respuesta completa:', respuesta);
            console.log('📥 respuesta.datos:', respuesta?.datos);
            console.log('📥 ¿Es arreglo?', Array.isArray(respuesta?.datos));

            const lista = Array.isArray(respuesta?.datos) ? respuesta.datos : [];

            this.asesorias = lista.sort((a: InformacionAsesoriaDTO, b: InformacionAsesoriaDTO) => {
              const fechaA = new Date(a.fechaHora).getTime();
              const fechaB = new Date(b.fechaHora).getTime();
              return fechaB - fechaA;
            });

            console.log('✅ Asesorías cargadas en componente:', this.asesorias);
          } catch (e) {
            console.error('❌ Error procesando asesorías:', e);
            this.mensajeError = 'Ocurrió un problema al procesar las asesorías.';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error al obtener asesorías:', error);
          this.mensajeError =
            error.error?.mensaje ||
            error.error?.datos ||
            'No fue posible cargar tus asesorías.';
        }
      });
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

  public obtenerTextoEstado(estado: EstadoAsesoria   | string): string {
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
      default:
        return 'estado';
    }
  }

  public trackByAsesoria(index: number, asesoria: InformacionAsesoriaDTO): string {
    return asesoria.id;
  }
}