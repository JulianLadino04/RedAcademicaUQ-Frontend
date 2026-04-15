import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Token } from '../../servicios/token';
import { PublicoService } from '../../servicios/publico';
import { Auth } from '../../servicios/auth';
import { obtenerNombreDTO } from '../../dto/cuenta/obtener-nombre';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  title: string = 'Red Academica UQ';
  isLogged: boolean = false;
  email: string = '';
  user: string = '';

  constructor(
    private tokenService: Token,
    private authService: Auth
  ) {}

  ngOnInit() {
    this.isLogged = this.tokenService.isLogged();

    if (this.isLogged) {
      const data = this.tokenService.verTokenDecodificado(); // 🔥 aquí

      console.log('👀 Datos del token:', data);

      this.user = data?.nombre || data?.name || data?.sub; // prueba campos
    }
  }

  public async obtenerNombreUsuario(): Promise<string> {
  const email = this.tokenService.getEmail();
  console.log('📧 Email enviado:', email);

  const obtenerNombreDTO: obtenerNombreDTO = { email };

  const data = await firstValueFrom(
    this.authService.obtenerNombre(obtenerNombreDTO)
  );

  console.log('📥 Respuesta del backend:', data);
  console.log('👤 Nombre obtenido:', data.respuesta);

  return data.respuesta;
}

  public logout() {
    this.tokenService.logout();
  }
}