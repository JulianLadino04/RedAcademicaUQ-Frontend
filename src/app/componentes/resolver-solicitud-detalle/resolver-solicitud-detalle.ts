import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { SolicitudAyudaService } from '../../servicios/solicitud-ayuda';
import { RespuestaSolicitudService } from '../../servicios/respuesta-solicitud';
import { ContenidosAcademicosService } from '../../servicios/contenido-academico';
import { Token } from '../../servicios/token';

import { InformacionSolicitudAyudaDTO } from '../../dto/solicitud/informacion-solicitud-ayuda.dto';
import { EstadoSolicitud } from '../../dto/enums';
import { InformacionRespuestaSolicitudDTO } from '../../dto/solicitud/informacion-respuesta-solicitud';
import { CrearRespuestaSolicitudDTO } from '../../dto/solicitud/crear-respuesta-solicitud';

@Component({
  selector: 'app-resolver-solicitud-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resolver-solicitud-detalle.html',
  styleUrls: ['./resolver-solicitud-detalle.css']
})
export class ResolverSolicitudDetalleComponent implements OnInit {

  solicitudId = '';
  solicitud: InformacionSolicitudAyudaDTO | null = null;
  respuestas: InformacionRespuestaSolicitudDTO[] = [];

  formulario!: FormGroup;

  cargandoSolicitud = false;
  cargandoRespuestas = false;
  guardandoRespuesta = false;
  subiendoAdjunto = false;

  mensajeError = '';
  mensajeExito = '';

  archivoSeleccionado: File | null = null;
  ultimaRespuestaId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private solicitudAyudaService: SolicitudAyudaService,
    private respuestaSolicitudService: RespuestaSolicitudService,
    private contenidoAcademicoService: ContenidosAcademicosService,
    private tokenService: Token
  ) {}

  ngOnInit(): void {
    this.crearFormulario();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.mensajeError = 'No se recibió el identificador de la solicitud.';
        return;
      }

      this.solicitudId = id;
      this.cargarSolicitud();
      this.cargarRespuestas();
    });
  }

  private crearFormulario(): void {
    this.formulario = this.fb.group({
      comentario: ['', [Validators.maxLength(300)]],
      textoRespuesta: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5000)]],
      contenidoAcademicoId: [''],
      esRespuestaFinal: [false]
    });
  }

  private obtenerUsuarioActual(): { id: string | null; nombre: string } {
    const data = this.tokenService.verTokenDecodificado();

    return {
      id: data?.id || data?._id || data?.userId || null,
      nombre: data?.nombre || data?.name || 'Usuario'
    };
  }

  private cargarSolicitud(): void {
    this.cargandoSolicitud = true;
    this.mensajeError = '';

    this.solicitudAyudaService.obtenerTodas().subscribe({
      next: (resp) => {
        const lista = Array.isArray(resp?.datos) ? resp.datos : [];
        this.solicitud = lista.find(s => s.id === this.solicitudId) || null;

        if (!this.solicitud) {
          this.mensajeError = 'No se encontró la solicitud.';
        }

        this.cargandoSolicitud = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar solicitud:', error);
        this.cargandoSolicitud = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible cargar la solicitud.';
        this.cdr.detectChanges();
      }
    });
  }

  private cargarRespuestas(): void {
    this.cargandoRespuestas = true;

    this.respuestaSolicitudService.obtenerPorSolicitud(this.solicitudId).subscribe({
      next: (resp) => {
        this.respuestas = Array.isArray(resp?.datos) ? resp.datos : [];
        this.cargandoRespuestas = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar respuestas:', error);
        this.cargandoRespuestas = false;
        this.cdr.detectChanges();
      }
    });
  }

  public seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    } else {
      this.archivoSeleccionado = null;
    }
  }

  public guardarRespuesta(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const usuario = this.obtenerUsuarioActual();

    if (!usuario.id) {
      this.mensajeError = 'No fue posible identificar el usuario autenticado.';
      return;
    }

    this.guardandoRespuesta = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const dto: CrearRespuestaSolicitudDTO = {
      solicitudId: this.solicitudId,
      autorId: usuario.id,
      autorNombre: usuario.nombre,
      comentario: this.formulario.value.comentario?.trim() || '',
      textoRespuesta: this.formulario.value.textoRespuesta?.trim(),
      contenidoAcademicoId: this.formulario.value.contenidoAcademicoId?.trim() || null,
      esRespuestaFinal: !!this.formulario.value.esRespuestaFinal
    };

    this.respuestaSolicitudService.crearRespuesta(dto).subscribe({
      next: (resp) => {
        this.ultimaRespuestaId = resp?.datos || null;
        this.mensajeExito = resp?.mensaje || 'Respuesta guardada correctamente.';
        this.guardandoRespuesta = false;

        if (this.archivoSeleccionado && this.ultimaRespuestaId) {
          this.subirAdjuntoLuegoDeGuardar(this.ultimaRespuestaId);
          return;
        }

        this.formulario.reset({
          comentario: '',
          textoRespuesta: '',
          contenidoAcademicoId: '',
          esRespuestaFinal: false
        });
        this.archivoSeleccionado = null;
        this.cargarRespuestas();
        this.cargarSolicitud();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al guardar respuesta:', error);
        this.guardandoRespuesta = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible guardar la respuesta.';
        this.cdr.detectChanges();
      }
    });
  }

  private subirAdjuntoLuegoDeGuardar(respuestaId: string): void {
    if (!this.archivoSeleccionado) return;

    this.subiendoAdjunto = true;

    this.respuestaSolicitudService.subirAdjunto(respuestaId, this.archivoSeleccionado).subscribe({
      next: () => {
        this.subiendoAdjunto = false;
        this.mensajeExito = 'Respuesta y archivo guardados correctamente.';
        this.formulario.reset({
          comentario: '',
          textoRespuesta: '',
          contenidoAcademicoId: '',
          esRespuestaFinal: false
        });
        this.archivoSeleccionado = null;
        this.cargarRespuestas();
        this.cargarSolicitud();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al subir adjunto:', error);
        this.subiendoAdjunto = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'La respuesta se guardó, pero no fue posible subir el archivo.';
        this.cargarRespuestas();
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
    return tema
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
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

  get campoComentario() {
    return this.formulario.get('comentario');
  }

  get campoTextoRespuesta() {
    return this.formulario.get('textoRespuesta');
  }

  get campoContenidoAcademicoId() {
    return this.formulario.get('contenidoAcademicoId');
  }
}