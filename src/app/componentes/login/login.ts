import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { Token } from '../../servicios/token';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LoginDTO } from '../../dto/cuenta/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private tokenService: Token,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public iniciarSesion() {
    console.log('🚀 Iniciando proceso de login...');
      if (this.loginForm.invalid) {
        console.warn('⚠️ Formulario inválido:', this.loginForm.value);
        Swal.fire('Error', 'Por favor completa correctamente el correo y la contraseña', 'error');
        return;
      }

      const loginDTO = this.loginForm.value as LoginDTO;

      console.log('📤 Datos enviados al backend:', loginDTO);

      this.authService.iniciarSesion(loginDTO).subscribe({
        next: (response: any) => {
    console.log('📥 RESPUESTA REAL:', response);

    if (!response || !response.datos || !response.datos.token) {
      Swal.fire('Error', 'Respuesta inválida del servidor', 'error');
      return;
    }

    // 🔍 Mostrar el token completo
    console.log('🔐 TOKEN COMPLETO:', response.datos.token);

    // 🔍 Mostrar tipo de dato
    console.log('🔍 Tipo de token:', typeof response.datos.token);

    // 🔍 Mostrar longitud (útil para validar JWT)
    console.log('📏 Longitud del token:', response.datos.token.length);

    const token = response.datos.token;

    this.tokenService.login(token);

    console.log('✅ Token guardado en el servicio');

    Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success');
    this.router.navigate(['/']);
  },
    error: (err: any) => {
        console.error('❌ ERROR COMPLETO:', err);
        console.error('📛 Status:', err.status);
        console.error('📛 Mensaje:', err.error);

        const mensaje =
          err.error?.respuesta ||
          err.error?.mensaje ||
          err.error?.message ||
          'Error en el inicio de sesión';

        Swal.fire('Error', mensaje, 'error');
      },
      complete: () => {
        console.log('🏁 Proceso de login finalizado');
      }
    });
  }
}