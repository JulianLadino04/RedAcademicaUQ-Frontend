import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { LoginDTO } from '../dto/login-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
@Injectable({
providedIn: 'root'
})
export class Auth {
  private authURL = "http://localhost:8080/api/auth";
  constructor(private http: HttpClient) { }

  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
  }
  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }
}