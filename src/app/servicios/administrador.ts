import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/chat/mensaje-dto';
import { Observable } from 'rxjs';
import { CrearEventoDTO } from '../dto/eventos/crear-evento.dto';
import { EditarEventoDTO } from '../dto/eventos/editar-evento.dto';
@Injectable({
providedIn: 'root'
})
export class Administrador {
    private adminURL = "http://localhost:8080/api/admin";
    constructor(private http: HttpClient) { }
    public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO> {
      return this.http.post<MensajeDTO>(`${this.adminURL}/evento/crear`, crearEventoDTO);
    }
    public actualizarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO> {
      return this.http.put<MensajeDTO>(`${this.adminURL}/evento/editar`, editarEventoDTO);
    }
    public obtenerEvento(id: string): Observable<MensajeDTO> {
      return this.http.get<MensajeDTO>(`${this.adminURL}/evento/obtener/${id}`);
    }
    public eliminarEvento(id: string): Observable<MensajeDTO> {
      return this.http.delete<MensajeDTO>(`${this.adminURL}/evento/eliminar/${id}`);
    }
    public listarEventosAdmin(pagina: number): Observable<MensajeDTO> {
      return this.http.get<MensajeDTO>(`${this.adminURL}/evento/obtener-todos/${pagina}`);
    }
    public subirImagen(imagen: FormData): Observable<MensajeDTO> {
      return this.http.post<MensajeDTO>(`${this.adminURL}/imagen/subir`, imagen);
    }
}