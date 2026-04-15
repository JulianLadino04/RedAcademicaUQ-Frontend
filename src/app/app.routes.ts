import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Registro } from './componentes/registro/registro';
import { Inicio } from './componentes/inicio/inicio';
import { GestionEventos } from './componentes/gestion-eventos/gestion-eventos';
import { DetalleEvento } from './componentes/detalle-evento/detalle-evento';
import { RecuperarPassword } from './componentes/recuperar-password/recuperar-password';
import { VerificarCodigo } from './componentes/verificar-codigo/verificar-codigo';
import { RestablecerPassword } from './componentes/restablecer-password/restablecer-password';
import { ContenidosAcademicos } from './componentes/contenidos-academicos/contenidos-academicos';
import { LoginGuard } from './guards/permiso';


export const routes: Routes = [

  { path: '', component: Inicio },

  { path: 'login', component: Login, canActivate: [LoginGuard] },
  { path: 'registro', component: Registro, canActivate: [LoginGuard] },
  { path: 'recuperar-password', component: RecuperarPassword, canActivate: [LoginGuard] },
  { path: 'verificar-codigo', component: VerificarCodigo, canActivate: [LoginGuard] },
  { path: 'restablecer-password', component: RestablecerPassword, canActivate: [LoginGuard] },
  { path: "gestion-eventos", component: GestionEventos },
  { path: 'detalle-evento/:id', component: DetalleEvento },
  { path: 'contenidos-academicos', component: ContenidosAcademicos },
  

];