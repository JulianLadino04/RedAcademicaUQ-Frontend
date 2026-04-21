import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ContenidosAcademicosService } from '../../servicios/contenido-academico';
@Component({
  selector: 'app-subir-contenido-academico',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './subir-contenido-academico.html',
  styleUrl: './subir-contenido-academico.css'
})
export class SubirContenidoAcademico {

  contenidoForm!: FormGroup;
  cargando = false;
  archivoSeleccionado: File | null = null;
  nombreArchivo = '';

  temas: { label: string, value: string }[] = [
    { label: 'Matemáticas', value: 'MATEMATICAS' },
    { label: 'Lenguaje', value: 'LENGUAJE' },
    { label: 'Ciencias Naturales', value: 'CIENCIAS_NATURALES' },
    { label: 'Ciencias Sociales', value: 'CIENCIAS_SOCIALES' },
    { label: 'Tecnología', value: 'TECNOLOGIA' },
    { label: 'Informática', value: 'INFORMATICA' },
    { label: 'Inglés', value: 'INGLES' },
    { label: 'Otro', value: 'OTRO' }
  ];

  tiposArchivo: { label: string, value: string }[] = [
    { label: 'PDF', value: 'PDF' },
    { label: 'Documento Word', value: 'WORD' },
    { label: 'Presentación', value: 'PPT' },
    { label: 'Imagen', value: 'IMAGEN' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Audio', value: 'AUDIO' }
  ];

  constructor(
    private fb: FormBuilder,
    private contenidosAcademicosService: ContenidosAcademicosService
  ) {
    this.crearFormulario();
  }

  private crearFormulario(): void {
    this.contenidoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      tema: ['', [Validators.required]],
      tipoContenido: ['', [Validators.required]],
      autor: ['', [Validators.required]]
    });
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      this.nombreArchivo = this.archivoSeleccionado.name;
    }
  }

  subirContenido(): void {
    if (this.contenidoForm.invalid || !this.archivoSeleccionado) {
      this.contenidoForm.markAllAsTouched();

      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Debes completar todos los campos y seleccionar un archivo',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.contenidoForm.get('titulo')?.value);
    formData.append('tema', this.contenidoForm.get('tema')?.value);
    formData.append('tipoContenido', this.contenidoForm.get('tipoContenido')?.value);
    formData.append('autor', this.contenidoForm.get('autor')?.value);
    formData.append('archivo', this.archivoSeleccionado);

    this.cargando = true;

    this.contenidosAcademicosService.subirContenido(formData).subscribe({
      next: (response: any) => {
        this.cargando = false;

        Swal.fire({
          title: 'Contenido cargado',
          text: response?.respuesta || 'El contenido académico se ha subido correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        this.contenidoForm.reset();
        this.archivoSeleccionado = null;
        this.nombreArchivo = '';
      },
      error: (error) => {
        this.cargando = false;

        const mensaje =
          error.error?.respuesta ||
          'No fue posible subir el contenido académico';

        Swal.fire({
          title: 'Error',
          text: mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  cancelar(): void {
    this.contenidoForm.reset();
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
  }
}