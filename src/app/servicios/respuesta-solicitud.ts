import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../dto/shared/response.dto';
import { CrearRespuestaSolicitudDTO } from '../dto/solicitud/crear-respuesta-solicitud';
import { InformacionRespuestaSolicitudDTO } from '../dto/solicitud/informacion-respuesta-solicitud';

@Injectable({
  providedIn: 'root'
})
export class RespuestaSolicitudService {

  private respuestaURL = 'http://localhost:8080/api/respuestas-solicitud';

  constructor(private http: HttpClient) {}

  public crearRespuesta(dto: CrearRespuestaSolicitudDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(
      `${this.respuestaURL}/crear`,
      dto
    );
  }

  public obtenerPorSolicitud(solicitudId: string): Observable<ResponseDTO<InformacionRespuestaSolicitudDTO[]>> {
    return this.http.get<ResponseDTO<InformacionRespuestaSolicitudDTO[]>>(
      `${this.respuestaURL}/solicitud/${solicitudId}`
    );
  }

  public marcarComoFinal(respuestaId: string): Observable<ResponseDTO<string>> {
    return this.http.put<ResponseDTO<string>>(
      `${this.respuestaURL}/marcar-final/${respuestaId}`,
      {}
    );
  }

  public subirAdjunto(respuestaId: string, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('respuestaId', respuestaId);
    formData.append('archivo', archivo);

    return this.http.post(`${this.respuestaURL}/subir-adjunto`, formData);
  }

  public descargarAdjunto(archivoId: string): Observable<Blob> {
    return this.http.get(`${this.respuestaURL}/archivo/${archivoId}`, {
      responseType: 'blob'
    });
  }
}