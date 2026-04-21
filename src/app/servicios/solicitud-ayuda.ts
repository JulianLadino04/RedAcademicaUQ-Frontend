import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../dto/shared/response.dto';
import { CrearSolicitudAyudaDTO } from '../dto/solicitud/crear-solicitud-ayuda.dto';
import { InformacionSolicitudAyudaDTO } from '../dto/solicitud/informacion-solicitud-ayuda.dto';

export interface AtenderSolicitudDTO {
  solicitudId: string;
  mentorId: string;
}

export interface CerrarSolicitudDTO {
  solicitudId: string;
  solicitanteId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudAyudaService {

  private solicitudURL = 'http://localhost:8080/api/solicitudes-ayuda';

  constructor(private http: HttpClient) {}

  public crearSolicitud(dto: CrearSolicitudAyudaDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(
      `${this.solicitudURL}/crear-solicitud`,
      dto
    );
  }

  public obtenerPorSolicitante(solicitanteId: string): Observable<ResponseDTO<InformacionSolicitudAyudaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionSolicitudAyudaDTO[]>>(
      `${this.solicitudURL}/solicitante/${solicitanteId}`
    );
  }

  public obtenerTodas(): Observable<ResponseDTO<InformacionSolicitudAyudaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionSolicitudAyudaDTO[]>>(this.solicitudURL);
  }

  public obtenerPorEstado(estado: string): Observable<ResponseDTO<InformacionSolicitudAyudaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionSolicitudAyudaDTO[]>>(
      `${this.solicitudURL}/estado/${estado}`
    );
  }

  public obtenerActivas(): Observable<ResponseDTO<InformacionSolicitudAyudaDTO[]>> {
    return this.http.get<ResponseDTO<InformacionSolicitudAyudaDTO[]>>(
      `${this.solicitudURL}/activas`
    );
  }

  public atenderSolicitud(dto: AtenderSolicitudDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(
      `${this.solicitudURL}/atender`,
      dto
    );
  }

  public cerrarSolicitud(dto: CerrarSolicitudDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(
      `${this.solicitudURL}/cerrar`,
      dto
    );
  }
}