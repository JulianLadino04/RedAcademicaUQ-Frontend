import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/chat/mensaje-dto';
import { Observable } from 'rxjs';
import { BuscarContenidoDTO } from '../dto/contenido/buscar-contenido.dto';
@Injectable({
providedIn: 'root'
})
export class PublicoService {
  private publicoURL = "http://localhost:8080/api/publico";
  constructor(private http: HttpClient) { }
  
  public listarTipos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener-tipos`);
  }
  public listarCiudades(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener-ciudades`);
  }
  public listarEventos(pagina: number): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener-todos/${pagina}`);
  }
  public obtenerEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener/${id}`);
  }
  public listarContenidos(buscarDTO: BuscarContenidoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.publicoURL}/contenido/buscar`, buscarDTO);
  }
  public obtenerContenido(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/contenido/obtener/${id}`);
  }
}