import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Token } from '../../servicios/token';
import { Auth } from '../../servicios/auth';

interface NavLink {
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  title: string = '';
  isLogged: boolean = false;
  user: string = '';
  rol: string = '';

  readonly navLinks: NavLink[] = [
    { label: 'Contenidos Académicos', route: '/contenidos-academicos', roles: ['ADMINISTRADOR', 'ESTUDIANTE'] },
    { label: 'Subir Contenido', route: '/subir-contenido', roles: ['ASESOR', 'ADMINISTRADOR'] },
    { label: 'Agendar Asesoría', route: '/agendar-asesoria', roles: ['ESTUDIANTE'] },
    { label: 'Resolver Solicitud', route: '/resolver-solicitud', roles: ['ASESOR','ESTUDIANTE'] },
    { label: 'Solicitar Ayuda', route: '/solicitar-ayuda', roles: ['ESTUDIANTE'] },
    { label: 'Chat', route: '/chat', roles: ['ESTUDIANTE', 'ASESOR'] },
    { label: 'Mis Solicitudes', route: '/mis-solicitudes-ayuda', roles: ['ESTUDIANTE'] },
    { label: 'Mis Asesorías', route: '/mis-asesorias', roles: ['ESTUDIANTE'] },
    { label: 'Asesorías Mentor', route: '/asesorias-mentor', roles: ['ASESOR'] },
    { label: 'Admin Mentores', route: '/admin-mentores', roles: ['ADMINISTRADOR'] },
  ];

  constructor(
    private tokenService: Token,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarSesion();
  }

  cargarSesion(): void {
    this.isLogged = this.tokenService.isLogged();

    if (this.isLogged) {
      const data = this.tokenService.verTokenDecodificado();
      this.user = data?.nombre || data?.name || data?.sub || 'Usuario';
      this.rol = this.tokenService.getRol() || '';
    } else {
      this.user = '';
      this.rol = '';
    }
  }

  puedeVer(link: NavLink): boolean {
    if (link.roles.length === 0) return true;
    if (!this.isLogged) return false;
    return link.roles.includes(this.rol);
  }

  logout(): void {
    this.tokenService.logout();
    this.isLogged = false;
    this.user = '';
    this.rol = '';
    this.router.navigate(['/login']);
  }
}