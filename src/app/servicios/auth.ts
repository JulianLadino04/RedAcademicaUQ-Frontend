import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearEstudianteDTO } from '../dto/cuenta/crear-estudiante';
import { LoginDTO } from '../dto/cuenta/login.dto';
import { RecuperarPasswordDTO } from '../dto/cuenta/recuperar-password.dto';
import { VerificarCodigoDTO } from '../dto/cuenta/verificar-codigo.dto';
import { RestablecerPasswordDTO } from '../dto/cuenta/restablecer-password.dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { TokenDTO } from '../dto/token-dto';
import { Observable } from 'rxjs';
import { obtenerNombreDTO } from '../dto/cuenta/obtener-nombre';
import { ResponseDTO } from '../dto/shared/response.dto';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private authURL = "http://localhost:8080/api/auth";
  
  constructor(private http: HttpClient) { }

  //ESTUDIANTES

  public crearCuenta(cuentaDTO: CrearEstudianteDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-estudiante`, cuentaDTO);
  }

  public iniciarSesion(loginDTO: LoginDTO): Observable<any> {
    return this.http.post(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

  public recuperarPassword(recuperarDTO: RecuperarPasswordDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/recuperar-password`, recuperarDTO);
  }

  public verificarCodigo(verificarDTO: VerificarCodigoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/verificar-codigo-recuperacion`, verificarDTO);
  }

  public restablecerPassword(restablecerDTO: RestablecerPasswordDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/restablecer-password`, restablecerDTO);
  }

  public obtenerNombre(ObtenerNombreDTO : obtenerNombreDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/obtener-nombre`, ObtenerNombreDTO);
  }
  
}