import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {

  private url = "http://localhost:8080/api/estadisticas";

  constructor(private http: HttpClient) {}

  materiasMasSolicitadas(){
    return this.http.get<any[]>(`${this.url}/materias-mas-solicitadas`);
  }

  asesoresMasActivos(){
    return this.http.get<any[]>(`${this.url}/asesores-mas-activos`);
  }

  asesoriasPorEstado(){
    return this.http.get<any[]>(`${this.url}/asesorias-estado`);
  }

  solicitudesPorEstado(){
    return this.http.get<any[]>(`${this.url}/solicitudes-estado`);
  }

}