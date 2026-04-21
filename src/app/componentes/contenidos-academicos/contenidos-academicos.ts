import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BuscarContenidoDTO } from '../../dto/contenido/buscar-contenido.dto';
import { InformacionContenidoAcademicoDTO } from '../../dto/contenido/informacion-contenido-academico.dto';
import { Tema, TipoContenido } from '../../dto/enums';
import { CommonModule } from '@angular/common';
import { ContenidosAcademicosService } from '../../servicios/contenido-academico';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contenidos-academicos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contenidos-academicos.html',
  styleUrls: ['./contenidos-academicos.css']
})
export class ContenidosAcademicos implements OnInit {
  contenidos: InformacionContenidoAcademicoDTO[] = [];
  searchForm!: FormGroup;
  temas = Object.values(Tema);
  tipos = Object.values(TipoContenido);
  cargando = false;

  constructor(
    private contenidoAcademico: ContenidosAcademicosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    console.log('Componente ContenidosAcademicos inicializado');
    this.cargarTodosLosContenidos();
  }

  private crearFormulario(): void {
    this.searchForm = this.fb.group({
      textoBusqueda: [''],
      tema: [''],
      tipoContenido: [''],
      autor: ['']
    });
  }

  public buscarContenidos(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    const buscarDTO: BuscarContenidoDTO = {
      textoBusqueda: this.searchForm.value.textoBusqueda?.trim() || null,
      tema: this.searchForm.value.tema || null,
      tipoContenido: this.searchForm.value.tipoContenido || null,
      autor: this.searchForm.value.autor?.trim() || null,
      pagina: 0,
      tamano: 50
    };

    console.log('📤 DTO enviado al backend:', buscarDTO);

    this.contenidoAcademico.listarContenidos(buscarDTO).subscribe({
      next: (data: any) => {
        console.log('✅ Respuesta búsqueda:', data);
        this.contenidos = Array.isArray(data?.respuesta) ? [...data.respuesta] : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error al buscar contenidos:', error);
        console.error('❌ Body del error:', error.error);
        this.contenidos = [];
        this.cargando = false;
        this.cdr.detectChanges();

        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'No fue posible buscar los contenidos académicos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  public cargarTodosLosContenidos(): void {
    console.log('Cargando todos los contenidos...');
    this.cargando = true;
    this.cdr.detectChanges();

    this.contenidoAcademico.obtenerTodosContenidos().subscribe({
      next: (data: any) => {
        console.log('Respuesta obtenida:', JSON.stringify(data));
        console.log('¿Es arreglo?', Array.isArray(data?.respuesta));
        console.log('Cantidad en data.respuesta:', data?.respuesta?.length);

        this.contenidos = Array.isArray(data?.respuesta) ? [...data.respuesta] : [];

        console.log('Contenidos finales:', this.contenidos);
        console.log('Contenidos cargados:', this.contenidos.length);

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar contenidos:', error);
        this.contenidos = [];
        this.cargando = false;
        this.cdr.detectChanges();

        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'No fue posible cargar los contenidos académicos',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  public limpiarFiltros(): void {
    this.searchForm.reset();
    this.cargarTodosLosContenidos();
  }

  public formatearTamano(bytes: number): string {
    if (!bytes && bytes !== 0) return 'No disponible';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  public verContenido(contenido: InformacionContenidoAcademicoDTO): void {
    if (!contenido.id) {
      Swal.fire({
        title: 'Error',
        text: 'Este contenido no tiene identificador válido',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.contenidoAcademico.descargarArchivo(contenido.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      error: (error) => {
        console.error('Error al abrir archivo:', error);

        Swal.fire({
          title: 'Error',
          text: error.error?.respuesta || 'No fue posible abrir el archivo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}