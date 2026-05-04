import { Injectable } from '@angular/core';

export interface TutoriaDTO {
  id: string;
  titulo: string;
  descripcion: string;
  materia: string;
  tutor: string;
  fecha: Date;
  modalidad: string;
  cupos: number;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutoriasService {
  tutorias: TutoriaDTO[] = [];

  constructor() {
    this.crearTutoriasPrueba();
  }

  public crearTutoriasPrueba() {
    this.tutorias.push({
      id: '1',
      titulo: 'Tutoría de Cálculo Diferencial',
      descripcion: 'Explicación de derivadas y reglas básicas',
      materia: 'Cálculo',
      tutor: 'Juan Pérez',
      fecha: new Date(),
      modalidad: 'Virtual',
      cupos: 10,
      imagen: 'https://picsum.photos/300/200?random=1'
    });

    this.tutorias.push({
      id: '2',
      titulo: 'Tutoría de Programación Java',
      descripcion: 'POO, clases y objetos en detalle',
      materia: 'Programación',
      tutor: 'Laura Gómez',
      fecha: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
      modalidad: 'Presencial',
      cupos: 8,
      imagen: 'https://picsum.photos/300/200?random=2'
    });

    this.tutorias.push({
      id: '3',
      titulo: 'Tutoría de Física 1',
      descripcion: 'Cinemática y dinámica clásica',
      materia: 'Física',
      tutor: 'Carlos Rodríguez',
      fecha: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
      modalidad: 'Virtual',
      cupos: 15,
      imagen: 'https://picsum.photos/300/200?random=3'
    });

    this.tutorias.push({
      id: '4',
      titulo: 'Tutoría de Base de Datos',
      descripcion: 'SQL, normalización y modelado',
      materia: 'Bases de Datos',
      tutor: 'María López',
      fecha: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
      modalidad: 'Híbrida',
      cupos: 12,
      imagen: 'https://picsum.photos/300/200?random=4'
    });

    this.tutorias.push({
      id: '5',
      titulo: 'Tutoría de Inglés Intermedio',
      descripcion: 'Gramática avanzada y conversación',
      materia: 'Inglés',
      tutor: 'David Thompson',
      fecha: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
      modalidad: 'Virtual',
      cupos: 20,
      imagen: 'https://picsum.photos/300/200?random=5'
    });

    this.tutorias.push({
      id: '6',
      titulo: 'Tutoría de Algoritmos',
      descripcion: 'Ordenamiento, búsqueda y estructuras',
      materia: 'Algoritmos',
      tutor: 'Ana Martínez',
      fecha: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
      modalidad: 'Presencial',
      cupos: 10,
      imagen: 'https://picsum.photos/300/200?random=6'
    });
  }

  public listar(): TutoriaDTO[] {
    return this.tutorias;
  }

  public obtener(id: string): TutoriaDTO | undefined {
    return this.tutorias.find(t => t.id === id);
  }

  public crear(tutorias: TutoriaDTO) {
    this.tutorias.push(tutorias);
  }

  public editar(id: string, tutoriasDTO: TutoriaDTO) {
    const indice = this.tutorias.findIndex(t => t.id === id);
    if (indice !== -1) {
      this.tutorias[indice] = tutoriasDTO;
    }
  }

  public eliminar(id: string) {
    this.tutorias = this.tutorias.filter(t => t.id !== id);
  }
}
