import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PublicoService } from '../../servicios/publico';
import { BuscarContenidoDTO } from '../../dto/contenido/buscar-contenido.dto';
import { InformacionContenidoAcademicoDTO } from '../../dto/contenido/informacion-contenido-academico.dto';
import { Tema, TipoContenido } from '../../dto/enums';
import { CommonModule } from '@angular/common';
import { ContenidosAcademicosService } from '../../servicios/contenido-academico';

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
    private publicoService: PublicoService,
    private contenidoAcademico: ContenidosAcademicosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    console.log('Componente ContenidosAcademicos inicializado');
    this.cargarTodosLosContenidos();
  }

  private crearFormulario() {
    this.searchForm = this.fb.group({
      textoBusqueda: [''],
      tema: [''],
      tipoContenido: [''],
      autor: ['']
    });
  }

  public buscarContenidos() {
    this.cargando = true;
    this.cdr.detectChanges();

    const buscarDTO: BuscarContenidoDTO = {
      ...this.searchForm.value,
      pagina: 0,
      tamaño: 50
    };

    this.contenidoAcademico.listarContenidos(buscarDTO).subscribe({
      next: (data: any) => {
        console.log('Respuesta búsqueda:', data);
        this.contenidos = Array.isArray(data?.datos) ? [...data.datos] : [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al buscar contenidos:', error);
        this.contenidos = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  public cargarTodosLosContenidos() {
    console.log('Cargando todos los contenidos...');
    this.cargando = true;
    this.cdr.detectChanges();

    this.contenidoAcademico.obtenerTodosContenidos().subscribe({
      next: (data: any) => {
        console.log('Respuesta obtenida:', JSON.stringify(data));
        console.log('¿Es arreglo?', Array.isArray(data?.datos));
        console.log('Cantidad en data.datos:', data?.datos?.length);

        this.contenidos = Array.isArray(data?.datos) ? [...data.datos] : [];

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
      }
    });
  }

  public limpiarFiltros() {
    this.searchForm.reset();
    this.cargarTodosLosContenidos();
  }
}