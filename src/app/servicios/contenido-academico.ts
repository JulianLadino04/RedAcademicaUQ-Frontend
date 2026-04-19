import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/chat/mensaje-dto';
import { Observable } from 'rxjs';
import { BuscarContenidoDTO } from '../dto/contenido/buscar-contenido.dto';

@Injectable({
  providedIn: 'root'
})
export class ContenidosAcademicosService {
  private URL = "http://localhost:8080/api/contenidos-academicos";

  constructor(private http: HttpClient) { }
  
  public listarContenidos(buscarDTO: BuscarContenidoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.URL}/buscar`, buscarDTO);
  }

  public obtenerContenido(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.URL}/obtener/${id}`);
  }

  public obtenerTodosContenidos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.URL}/obtener-contenidos`);
  }

  public subirContenido(formData: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.URL}/subir`, formData);
  }

  public descargarArchivo(id: string): Observable<Blob> {
    return this.http.get(`${this.URL}/archivo/${id}`, {
      responseType: 'blob'
    });
  }
}