import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SolicitudAyudaService } from '../../servicios/solicitud-ayuda';
import { Token } from '../../servicios/token';
import { Tema } from '../../dto/enums';
import { CrearSolicitudAyudaDTO } from '../../dto/solicitud/crear-solicitud-ayuda.dto';

@Component({
  selector: 'app-solicitar-ayuda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-ayuda.html',
  styleUrls: ['./solicitar-ayuda.css']
})
export class SolicitarAyudaComponent implements OnInit {

  public solicitudForm!: FormGroup;
  public cargando = false;
  public enviado = false;
  public mensajeError = '';
  public mensajeExito = '';

  public temasMock: Tema[] = [
    Tema.MATEMATICAS,
    Tema.LENGUAJE,
    Tema.CIENCIAS_NATURALES,
    Tema.CIENCIAS_SOCIALES,
    Tema.INGLES,
    Tema.TECNOLOGIA,
    Tema.INFORMATICA,
    Tema.OTRO
  ];

  public nivelesUrgencia: number[] = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private solicitudAyudaService: SolicitudAyudaService,
    private tokenService: Token
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.solicitudForm = this.fb.group({
      tema: ['', [Validators.required]],
      urgencia: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  private obtenerSolicitanteId(): string | null {
    const data = this.tokenService.verTokenDecodificado();
    console.log('🔐 Token decodificado:', data);

    return data?.id || data?._id || data?.userId || null;
  }

  public formatearTema(tema: string): string {
    return tema
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
  }

  public enviarSolicitud(): void {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }

    const solicitanteId = this.obtenerSolicitanteId();

    if (!solicitanteId) {
      this.mensajeError = 'No fue posible identificar el usuario autenticado.';
      return;
    }

    this.cargando = true;
    this.enviado = false;
    this.mensajeError = '';
    this.mensajeExito = '';

    const dto: CrearSolicitudAyudaDTO = {
      tema: this.solicitudForm.value.tema,
      urgencia: Number(this.solicitudForm.value.urgencia),
      solicitanteId: solicitanteId,
      descripcion: this.solicitudForm.value.descripcion.trim()
    };

    console.log('DTO a enviar:', dto);

    this.solicitudAyudaService.crearSolicitud(dto).subscribe({
      next: (resp) => {
        this.cargando = false;
        this.enviado = true;
        this.mensajeExito = resp.mensaje || 'Solicitud enviada correctamente.';
        this.solicitudForm.reset();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al crear solicitud:', error);
        this.cargando = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible enviar la solicitud.';
        this.cdr.detectChanges();
      }
    });
  }

  public verSolicitudes(): void {
    this.router.navigate(['/solicitudes']);
  }

  public volver(): void {
    window.history.back();
  }

  get campoTemaError(): boolean {
    const control = this.solicitudForm.get('tema');
    return !!(control && control.invalid && control.touched);
  }

  get campoUrgenciaError(): boolean {
    const control = this.solicitudForm.get('urgencia');
    return !!(control && control.invalid && control.touched);
  }

  get campoDescripcionError(): boolean {
    const control = this.solicitudForm.get('descripcion');
    return !!(control && control.invalid && control.touched);
  }
}