import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Registro } from './componentes/registro/registro';
import { Inicio } from './componentes/inicio/inicio';
import { RecuperarPassword } from './componentes/recuperar-password/recuperar-password';
import { VerificarCodigo } from './componentes/verificar-codigo/verificar-codigo';
import { RestablecerPassword } from './componentes/restablecer-password/restablecer-password';
import { ContenidosAcademicos } from './componentes/contenidos-academicos/contenidos-academicos';
import { LoginGuard } from './guards/permiso';
import { SubirContenidoAcademico } from './componentes/subir-contenido-academico/subir-contenido-academico';
import { AgendarAsesoriaComponent } from './componentes/agendar-asesoria/agendar-asesoria';
import { ResolverSolicitudComponent } from './componentes/resolver-solicitud/resolver-solicitud';
import { SolicitarAyudaComponent } from './componentes/solicitar-ayuda/solicitar-ayuda';
import { ChatComponent } from './componentes/chat/chat';
import { MisAsesoriasComponent } from './componentes/mis-asesorias/mis-asesorias';
import { AsesoriasMentorComponent } from './componentes/asesorias-mentor/asesorias-mentor';
import { AdminMentoresComponent } from './componentes/admin-mentores/admin-mentores';
import { ResolverSolicitudDetalleComponent } from './componentes/resolver-solicitud-detalle/resolver-solicitud-detalle';
import { MisSolicitudesAyudaComponent } from './componentes/mis-solicitudes-ayuda/mis-solicitudes-ayuda';
import { DetalleMiSolicitudComponent } from './componentes/detalle-mi-solicitud/detalle-mi-solicitud';

export const routes: Routes = [

  { path: '', component: Inicio },

  { path: 'login', component: Login, canActivate: [LoginGuard] },
  { path: 'registro', component: Registro, canActivate: [LoginGuard] },
  { path: 'recuperar-password', component: RecuperarPassword, canActivate: [LoginGuard] },
  { path: 'verificar-codigo', component: VerificarCodigo, canActivate: [LoginGuard] },
  { path: 'restablecer-password', component: RestablecerPassword, canActivate: [LoginGuard] },
  { path: 'contenidos-academicos', component: ContenidosAcademicos },
  { path: 'subir-contenido', component: SubirContenidoAcademico },
  { path: 'agendar-asesoria', component: AgendarAsesoriaComponent },
  { path: 'resolver-solicitud', component: ResolverSolicitudComponent },
  { path: 'solicitar-ayuda', component: SolicitarAyudaComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'mis-asesorias', component: MisAsesoriasComponent },
  { path: 'asesorias-mentor', component: AsesoriasMentorComponent },
  { path: 'admin-mentores', component: AdminMentoresComponent },
  { path: 'resolver-solicitud', component: ResolverSolicitudComponent },
  { path: 'resolver-solicitud/:id', component: ResolverSolicitudDetalleComponent },
  { path: 'mis-solicitudes-ayuda', component: MisSolicitudesAyudaComponent },
  { path: 'mis-solicitudes-ayuda/:id', component: DetalleMiSolicitudComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:id', component: ChatComponent },

];