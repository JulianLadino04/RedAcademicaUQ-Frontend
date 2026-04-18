import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Componente para la creación de nuevas solicitudes de ayuda académica.
 * Sigue la metodología Standalone de Angular 17+.
 */
@Component({
  selector: 'app-solicitar-ayuda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-ayuda.html',
  styleUrls: ['./solicitar-ayuda.css']
})
export class SolicitarAyudaComponent implements OnInit {
  
  public solicitudForm!: FormGroup;
  public cargando: boolean = false;
  public enviado: boolean = false;

  // ✅ DATOS MOCK para el formulario
  public temasMock: string[] = ['MATEMÁTICA', 'LENGUAJE', 'CIENCIAS', 'HISTORIA', 'INGLÉS'];
  public nivelesUrgencia: number[] = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Inicialización si se requiere carga de datos externos
  }

  /**
   * Inicializa el formulario reactivo basado en el DTO CrearSolicitudAyudaDTO
   */
  private initForm(): void {
    this.solicitudForm = this.fb.group({
      tema: ['', [Validators.required]],
      urgencia: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      solicitanteId: ['USER-UQ-123'] // ✅ ID MOCK representando al estudiante actual
    });
  }

  /**
   * Envía la solicitud al backend (Simulado)
   */
  public enviarSolicitud(): void {
    if (this.solicitudForm.invalid) return;

    this.cargando = true;
    
    // ✅ SIMULACIÓN DE PROCESO ASÍNCRONO
    setTimeout(() => {
      const data = this.solicitudForm.value;
      console.log('DTO a enviar:', data);
      
      this.cargando = false;
      this.enviado = true;
      
      // Forzar detección de cambios por el delay async
      this.cdr.detectChanges();
    }, 600);
  }

  /**
   * Navega a la pantalla de listado de solicitudes
   */
  public verSolicitudes(): void {
    this.router.navigate(['/solicitudes']);
  }

  /**
   * Regresa a la pantalla anterior
   */
  public volver(): void {
    window.history.back();
  }
}