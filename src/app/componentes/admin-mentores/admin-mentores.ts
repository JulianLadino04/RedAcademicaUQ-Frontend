import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InformacionMentorDTO } from '../../dto/mentor/informacion-mentor.dto';
import { CrearMentorDTO, MentorService } from '../../servicios/mentores';

@Component({
  selector: 'app-admin-mentores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-mentores.html',
  styleUrls: ['./admin-mentores.css']
})
export class AdminMentoresComponent implements OnInit {

  formulario!: FormGroup;
  mentores: InformacionMentorDTO[] = [];
  editandoId: string | null = null;

  cargando = false;
  guardando = false;
  eliminandoId: string | null = null;
  mensajeError = '';
  mensajeExito = '';

  especialidades: string[] = [
    'MATEMATICAS',
    'LENGUAJE',
    'CIENCIAS_NATURALES',
    'CIENCIAS_SOCIALES',
    'INGLES',
    'TECNOLOGIA',
    'INFORMATICA',
    'OTRO'
  ];

  constructor(
    private fb: FormBuilder,
    private mentorService: MentorService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      especialidad: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });

    this.listarMentores();
  }

  listarMentores(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.mentorService.listarMentoresAdmin().subscribe({
      next: (resp) => {
        this.mentores = resp.datos || [];
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'No fue posible cargar los mentores.';
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const dto: CrearMentorDTO = {
      nombre: this.formulario.value.nombre?.trim(),
      email: this.formulario.value.email?.trim(),
      especialidad: this.formulario.value.especialidad,
      password: this.formulario.value.password
    };

    if (this.editandoId) {
      this.mentorService.actualizarMentor(this.editandoId, dto).subscribe({
        next: (resp) => {
          this.mensajeExito = resp.mensaje || 'Mentor actualizado correctamente.';
          this.restablecerFormulario();
          this.guardando = false;
          this.listarMentores();
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'No fue posible actualizar el mentor.';
          this.guardando = false;
        }
      });
    } else {
      this.mentorService.crearMentor(dto).subscribe({
        next: (resp) => {
          this.mensajeExito = resp.mensaje || 'Mentor creado correctamente.';
          this.restablecerFormulario();
          this.guardando = false;
          this.listarMentores();
        },
        error: (err) => {
          this.mensajeError = err.error?.mensaje || 'No fue posible crear el mentor.';
          this.guardando = false;
        }
      });
    }
  }

  editar(mentor: InformacionMentorDTO): void {
    this.editandoId = mentor.id;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.formulario.patchValue({
      nombre: mentor.nombre,
      email: mentor.email,
      especialidad: mentor.especialidad,
      password: ''
    });

    this.formulario.get('password')?.setValidators([
      Validators.minLength(6),
      Validators.maxLength(20)
    ]);
    this.formulario.get('password')?.updateValueAndValidity();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: string): void {
    if (!confirm('¿Deseas eliminar este mentor?')) {
      return;
    }

    this.eliminandoId = id;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.mentorService.eliminarMentor(id).subscribe({
      next: (resp) => {
        this.mensajeExito = resp.mensaje || 'Mentor eliminado correctamente.';
        this.eliminandoId = null;

        if (this.editandoId === id) {
          this.restablecerFormulario();
        }

        this.listarMentores();
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'No fue posible eliminar el mentor.';
        this.eliminandoId = null;
      }
    });
  }

  cancelarEdicion(): void {
    this.restablecerFormulario();
  }

  private restablecerFormulario(): void {
    this.editandoId = null;
    this.formulario.reset();

    this.formulario.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]);
    this.formulario.get('password')?.updateValueAndValidity();
  }

  formatearEspecialidad(valor: string): string {
    return valor
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
  }

  get campoNombre() {
    return this.formulario.get('nombre');
  }

  get campoEmail() {
    return this.formulario.get('email');
  }

  get campoEspecialidad() {
    return this.formulario.get('especialidad');
  }

  get campoPassword() {
    return this.formulario.get('password');
  }
}