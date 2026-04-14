import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearCuentaDTO } from '../dto/cuenta/crear-cuenta.dto';
import { LoginDTO } from '../dto/cuenta/login.dto';
import { RecuperarPasswordDTO } from '../dto/cuenta/recuperar-password.dto';
import { VerificarCodigoDTO } from '../dto/cuenta/verificar-codigo.dto';
import { RestablecerPasswordDTO } from '../dto/cuenta/restablecer-password.dto';
import { MensajeDTO } from '../dto/chat/mensaje-dto';
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

  public recuperarPassword(recuperarDTO: RecuperarPasswordDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/recuperar-password`, recuperarDTO);
  }

  public verificarCodigo(verificarDTO: VerificarCodigoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/verificar-codigo`, verificarDTO);
  }

  public restablecerPassword(restablecerDTO: RestablecerPasswordDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/restablecer-password`, restablecerDTO);
  }
}