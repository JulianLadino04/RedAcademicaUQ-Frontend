import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../dto/shared/response.dto';
import { InformacionMentorDTO } from '../dto/mentor/informacion-mentor.dto';

export interface CrearMentorDTO {
  nombre: string;
  email: string;
  especialidad: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class MentorService {

  private mentorURL = 'http://localhost:8080/api/mentores';
  private adminMentorURL = 'http://localhost:8080/api/mentores';

  constructor(private http: HttpClient) {}

  public obtenerTodos(): Observable<ResponseDTO<InformacionMentorDTO[]>> {
    return this.http.get<ResponseDTO<InformacionMentorDTO[]>>(this.mentorURL + '/obtener-mentores');
  }

  public buscarPorEspecialidad(especialidad: string): Observable<ResponseDTO<InformacionMentorDTO[]>> {
    return this.http.get<ResponseDTO<InformacionMentorDTO[]>>(
      `${this.mentorURL}/buscar/especialidad?especialidad=${encodeURIComponent(especialidad)}`
    );
  }

  public buscarPorNombre(nombre: string): Observable<ResponseDTO<InformacionMentorDTO[]>> {
    return this.http.get<ResponseDTO<InformacionMentorDTO[]>>(
      `${this.mentorURL}/buscar/nombre?nombre=${encodeURIComponent(nombre)}`
    );
  }

  public listarMentoresAdmin(): Observable<ResponseDTO<InformacionMentorDTO[]>> {
    return this.http.get<ResponseDTO<InformacionMentorDTO[]>>(this.adminMentorURL + '/listar-mentores-admin');
  }

  public crearMentor(dto: CrearMentorDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(`${this.adminMentorURL}/crear-mentor`, dto);
  }

  public actualizarMentor(id: string, dto: CrearMentorDTO): Observable<ResponseDTO<InformacionMentorDTO>> {
    return this.http.put<ResponseDTO<InformacionMentorDTO>>(`${this.adminMentorURL}/${id}`, dto);
  }

  public eliminarMentor(id: string): Observable<ResponseDTO<string>> {
    return this.http.delete<ResponseDTO<string>>(`${this.adminMentorURL}/${id}`);
  }
}