import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearAsesoriaDTO } from '../dto/asesoria/crear-asesoria.dto';
import { ResponseDTO } from '../dto/shared/response.dto';
import { InformacionAsesoriaDTO } from '../dto/asesoria/informacion-asesoria.dto';
import { EstadoAsesoria } from '../dto/enums';

@Injectable({
  providedIn: 'root'
})
export class AsesoriaService {

  private asesoriaURL = 'http://localhost:8080/api/asesorias';

  constructor(private http: HttpClient) {}

  public crearAsesoria(dto: CrearAsesoriaDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(`${this.asesoriaURL}/crear-asesoria`, dto);
  }

  public obtenerPorSolicitante(solicitanteId: string): Observable<ResponseDTO<InformacionAsesoriaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionAsesoriaDTO[]>>(
      `${this.asesoriaURL}/solicitante/${solicitanteId}`
    );
  }

  public obtenerPorAsesor(asesorId: string): Observable<ResponseDTO<InformacionAsesoriaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionAsesoriaDTO[]>>(
      `${this.asesoriaURL}/asesor/${asesorId}`
    );
  }

  public actualizarEstado(id: string, estado: EstadoAsesoria | string): Observable<ResponseDTO<string>> {
    return this.http.put<ResponseDTO<string>>(
      `${this.asesoriaURL}/${id}/estado/${estado}`,
      {}
    );
  }

  public obtenerPorId(id: string): Observable<ResponseDTO<any>> {
    return this.http.get<ResponseDTO<any>>(`${this.asesoriaURL}/${id}`);
  }

  public actualizarAsesoria(id: string, dto: CrearAsesoriaDTO): Observable<ResponseDTO<any>> {
    return this.http.put<ResponseDTO<any>>(`${this.asesoriaURL}/${id}`, dto);
  }

  public eliminarAsesoria(id: string): Observable<ResponseDTO<string>> {
    return this.http.delete<ResponseDTO<string>>(`${this.asesoriaURL}/${id}`);
  }

  public obtenerTodas(): Observable<ResponseDTO<InformacionAsesoriaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionAsesoriaDTO[]>>(`${this.asesoriaURL}/obtener-asesorias`);
  }

}