import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Token } from '../../servicios/token';
import { AsesoriaService } from '../../servicios/asesorias';
import { MentorService } from '../../servicios/mentores';

import { CrearAsesoriaDTO } from '../../dto/asesoria/crear-asesoria.dto';
import { InformacionMentorDTO } from '../../dto/mentor/informacion-mentor.dto';

@Component({
  selector: 'app-agendar-asesoria',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './agendar-asesoria.html',
  styleUrls: ['./agendar-asesoria.css']
})
export class AgendarAsesoriaComponent implements OnInit {
  formularioAgendar!: FormGroup;

  temas: string[] = [
    'MATEMATICAS',
    'LENGUAJE',
    'CIENCIAS_NATURALES',
    'CIENCIAS_SOCIALES',
    'INGLES',
    'TECNOLOGIA',
    'INFORMATICA',
    'OTRO'
  ];

  asesores: InformacionMentorDTO[] = [];

  medios: string[] = ['Presencial', 'Virtual', 'Híbrido'];

  cargando = false;
  cargandoMentores = false;
  enviando = false;
  mostrarMensajeExito = false;
  mensajeError = '';
  mensajeExito = '';
  horaMinima: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private tokenService: Token,
    private asesoriaService: AsesoriaService,
    private mentorService: MentorService
  ) {
    this.crearFormulario();
    this.establecerHoraMinima();
  }

  ngOnInit() {
    console.log('Componente AgendarAsesoria inicializado');
  }

  private crearFormulario() {
    this.formularioAgendar = this.fb.group({
      tema: ['', [Validators.required]],
      asesor: ['', [Validators.required]],
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      medios: ['', [Validators.required]]
    });
  }

  private establecerHoraMinima() {
    const ahora = new Date();
    ahora.setHours(ahora.getHours() + 1);
    this.horaMinima = ahora.toTimeString().slice(0, 5);
  }

  private construirFechaHora(fecha: string, hora: string): string {
    return `${fecha}T${hora}:00`;
  }

  private obtenerSolicitanteId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    console.log('🔐 Token decodificado:', data);

    return data?.id || data?._id || data?.userId || data?.sub || null;
  }

  public cargarMentoresPorTema() {
    const tema = this.formularioAgendar.get('tema')?.value;

    this.asesores = [];
    this.formularioAgendar.get('asesor')?.setValue('');
    this.mensajeError = '';

    if (!tema) return;

    this.cargandoMentores = true;

    this.mentorService.buscarPorEspecialidad(tema).subscribe({
      next: (respuesta) => {
        this.asesores = respuesta.datos || [];
        this.cargandoMentores = false;

        if (this.asesores.length === 0) {
          this.mensajeError = 'No hay mentores disponibles para el tema seleccionado.';
        }

        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar mentores:', error);
        this.cargandoMentores = false;
        this.mensajeError = error.error?.mensaje || 'No fue posible cargar los mentores.';
        this.cdr.detectChanges();
      }
    });
  }

  public agendar() {
    if (this.formularioAgendar.invalid) {
      this.formularioAgendar.markAllAsTouched();
      this.mensajeError = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const solicitanteId = this.obtenerSolicitanteId();

    if (!solicitanteId) {
      this.mensajeError = 'No se pudo identificar el usuario autenticado.';
      return;
    }

    this.enviando = true;
    this.mensajeError = '';
    this.mostrarMensajeExito = false;
    this.mensajeExito = '';
    this.cdr.detectChanges();

    const datosFormulario = this.formularioAgendar.value;

    const dto: CrearAsesoriaDTO = {
      solicitanteId: solicitanteId,
      asesorId: datosFormulario.asesor,
      tema: datosFormulario.tema,
      fechaHora: this.construirFechaHora(datosFormulario.fecha, datosFormulario.horaInicio),
      descripcion: `${datosFormulario.titulo}. ${datosFormulario.descripcion}`,
      medio: datosFormulario.medios
    };

    console.log('📤 DTO enviado al backend:', dto);

    this.asesoriaService.crearAsesoria(dto).subscribe({
      next: (respuesta) => {
        console.log('✅ Asesoría creada:', respuesta);
        this.mostrarMensajeExito = true;
        this.mensajeExito = respuesta.mensaje || 'Asesoría agendada exitosamente.';
        this.formularioAgendar.reset();
        this.asesores = [];
        this.enviando = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/mis-asesorias']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al crear asesoría:', error);
        this.enviando = false;
        this.mensajeError = error.error?.mensaje || 'No fue posible agendar la asesoría.';
        this.cdr.detectChanges();
      }
    });
  }

  public limpiarFormulario() {
    this.formularioAgendar.reset();
    this.asesores = [];
    this.mensajeError = '';
    this.mostrarMensajeExito = false;
    this.mensajeExito = '';
  }

  public volver() {
    window.history.back();
  }

  get campoTemaError(): boolean {
    const control = this.formularioAgendar.get('tema');
    return !!(control && control.invalid && control.touched);
  }

  get campoAsesorError(): boolean {
    const control = this.formularioAgendar.get('asesor');
    return !!(control && control.invalid && control.touched);
  }

  get campoTituloError(): boolean {
    const control = this.formularioAgendar.get('titulo');
    return !!(control && control.invalid && control.touched);
  }

  get campoDescripcionError(): boolean {
    const control = this.formularioAgendar.get('descripcion');
    return !!(control && control.invalid && control.touched);
  }

  get campoFechaError(): boolean {
    const control = this.formularioAgendar.get('fecha');
    return !!(control && control.invalid && control.touched);
  }

  get campoHoraError(): boolean {
    const control = this.formularioAgendar.get('horaInicio');
    return !!(control && control.invalid && control.touched);
  }

  get campoMediosError(): boolean {
    const control = this.formularioAgendar.get('medios');
    return !!(control && control.invalid && control.touched);
  }
}