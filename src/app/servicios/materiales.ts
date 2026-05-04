import { Injectable } from '@angular/core';

export interface MaterialDTO {
  id: string;
  titulo: string;
  tema: string;
  autor: string;
  tipoContenido: string;
  descripcion: string;
  fechaCreacion: Date;
  archivoUrl: string;
  calificacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  materiales: MaterialDTO[] = [];

  constructor() {
    this.crearMaterialesPrueba();
  }

  public crearMaterialesPrueba() {
    this.materiales.push({
      id: '1',
      titulo: 'Introducción a Python - Guía Completa',
      tema: 'Programación',
      autor: 'Juan Pérez',
      tipoContenido: 'PDF',
      descripcion: 'Guía completa con ejemplos prácticos de Python',
      fechaCreacion: new Date('2026-03-15'),
      archivoUrl: '/materiales/python-guide.pdf',
      calificacion: 4.8
    });

    this.materiales.push({
      id: '2',
      titulo: 'Formulario de Cálculo Diferencial',
      tema: 'Matemáticas',
      autor: 'María González',
      tipoContenido: 'Documento',
      descripcion: 'Todas las derivadas y reglas en un solo documento',
      fechaCreacion: new Date('2026-02-20'),
      archivoUrl: '/materiales/calculo-formulario.pdf',
      calificacion: 4.9
    });

    this.materiales.push({
      id: '3',
      titulo: 'Apuntes de Física Mecánica',
      tema: 'Física',
      autor: 'Carlos Rodríguez',
      tipoContenido: 'Apuntes',
      descripcion: 'Notas de clase con ejercicios resueltos',
      fechaCreacion: new Date('2026-01-10'),
      archivoUrl: '/materiales/fisica-mecanica.pdf',
      calificacion: 4.7
    });

    this.materiales.push({
      id: '4',
      titulo: 'Diseño de Bases de Datos - Casos Prácticos',
      tema: 'Bases de Datos',
      autor: 'Laura López',
      tipoContenido: 'Video Tutorial',
      descripcion: '5 casos de studio de diseño de BD from cero',
      fechaCreacion: new Date('2026-02-01'),
      archivoUrl: '/materiales/bd-casos.mp4',
      calificacion: 4.6
    });

    this.materiales.push({
      id: '5',
      titulo: 'Vocabulario en Inglés Técnico',
      tema: 'Inglés',
      autor: 'David Thompson',
      tipoContenido: 'Documento',
      descripcion: 'Vocabulario especializado para ingeniería y programación',
      fechaCreacion: new Date('2026-03-01'),
      archivoUrl: '/materiales/ingles-tecnico.pdf',
      calificacion: 4.5
    });

    this.materiales.push({
      id: '6',
      titulo: 'Algoritmos de Ordenamiento Explicados',
      tema: 'Algoritmos',
      autor: 'Ana Martínez',
      tipoContenido: 'Presentación',
      descripcion: 'Comparación de quicksort, mergesort, heapsort con animaciones',
      fechaCreacion: new Date('2026-02-28'),
      archivoUrl: '/materiales/algoritmos-sort.pptx',
      calificacion: 4.9
    });
  }

  public listar(): MaterialDTO[] {
    return this.materiales;
  }

  public obtener(id: string): MaterialDTO | undefined {
    return this.materiales.find(m => m.id === id);
  }

  public crear(material: MaterialDTO) {
    this.materiales.push(material);
  }

  public eliminar(id: string) {
    this.materiales = this.materiales.filter(m => m.id !== id);
  }

  public buscarPorTema(tema: string): MaterialDTO[] {
    return this.materiales.filter(m => m.tema.toLowerCase().includes(tema.toLowerCase()));
  }

  public buscarPorTipo(tipo: string): MaterialDTO[] {
    return this.materiales.filter(m => m.tipoContenido.toLowerCase().includes(tipo.toLowerCase()));
  }
}
