import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente para agendar asesorías CON DATOS MOCK
 * Esta es la versión de DESARROLLO para ver el diseño
 * sin necesidad de conectar con backend
 */
@Component({
  selector: 'app-agendar-asesoria',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './agendar-asesoria.html',
  styleUrls: ['./agendar-asesoria.css']
})
export class AgendarAsesoriaComponent implements OnInit {
  formularioAgendar!: FormGroup;
  
  asesores = [
    { id: 1, nombre: 'Dr. Juan García López', especialidad: 'Matemática', disponible: true },
    { id: 2, nombre: 'Dra. María López Pérez', especialidad: 'Física', disponible: true },
    { id: 3, nombre: 'Prof. Carlos Díaz Ruiz', especialidad: 'Programación', disponible: true },
    { id: 4, nombre: 'Ing. Patricia González', especialidad: 'Cálculo', disponible: true },
    { id: 5, nombre: 'Prof. Roberto Sánchez', especialidad: 'Álgebra', disponible: false }
  ];
  
  medios: string[] = ['Presencial', 'Virtual', 'Híbrido'];
  
  cargando = false;  // Desactiva el spinner de carga
  enviando = false;
  mostrarMensajeExito = false;
  mensajeError = '';
  horaMinima: string = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.crearFormulario();
    this.establecerHoraMinima();
  }

  ngOnInit() {
    console.log('Componente AgendarAsesoria inicializado (MODO DESARROLLO)');
  }

  /**
   * Crea el formulario reactivo con validaciones
   */
  private crearFormulario() {
    this.formularioAgendar = this.fb.group({
      asesor: ['', [Validators.required]],
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      medios: ['', [Validators.required]]
    });
  }

  /**
   * Establece la hora mínima para evitar seleccionar horas pasadas
   */
  private establecerHoraMinima() {
    const ahora = new Date();
    ahora.setHours(ahora.getHours() + 1);
    this.horaMinima = ahora.toTimeString().slice(0, 5);
  }

  /**
   * Simula el envío del formulario (sin conectar backend)
   */
  public agendar() {
    if (this.formularioAgendar.invalid) {
      this.mensajeError = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.enviando = true;
    this.mensajeError = '';
    this.mostrarMensajeExito = false;
    this.cdr.detectChanges();

    const datosFormulario = this.formularioAgendar.value;
    console.log('📋 Datos del formulario:', datosFormulario);

    // Simulamos un delay de 1.5 segundos como si fuera una petición HTTP
    setTimeout(() => {
      console.log('✅ Asesoría agendada (simulada)');
      this.mostrarMensajeExito = true;
      this.formularioAgendar.reset();
      this.enviando = false;
      this.cdr.detectChanges();

      // Redirige después de 2 segundos
      setTimeout(() => {
        console.log('Redirigiendo a /mis-asesorias...');
        // Descomentar si existe esa ruta:
        // this.router.navigate(['/mis-asesorias']);
      }, 2000);
    }, 1500);
  }

  /**
   * Limpia el formulario
   */
  public limpiarFormulario() {
    this.formularioAgendar.reset();
    this.mensajeError = '';
    this.mostrarMensajeExito = false;
  }

  /**
   * Vuelve a la página anterior
   */
  public volver() {
    window.history.back();
  }

  /**
   * Getters para validación de campos en el template
   */
  get tieneError(): boolean {
    return this.formularioAgendar.invalid && this.formularioAgendar.touched;
  }

  get campoAsesorError(): boolean {
    return this.formularioAgendar.get('asesor')?.invalid ?? false;
  }

  get campoTituloError(): boolean {
    return this.formularioAgendar.get('titulo')?.invalid ?? false;
  }

  get campoDescripcionError(): boolean {
    return this.formularioAgendar.get('descripcion')?.invalid ?? false;
  }

  get campoFechaError(): boolean {
    return this.formularioAgendar.get('fecha')?.invalid ?? false;
  }

  get campoHoraError(): boolean {
    return this.formularioAgendar.get('horaInicio')?.invalid ?? false;
  }

  get campoMediosError(): boolean {
    return this.formularioAgendar.get('medios')?.invalid ?? false;
  }
}