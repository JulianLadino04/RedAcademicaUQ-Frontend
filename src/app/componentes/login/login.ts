import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { Token } from '../../servicios/token';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      return;
    }

    const loginDTO = this.loginForm.value;

    console.log('📤 Datos enviados al backend:', loginDTO);

    this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data: any) => {

        console.log('📥 Respuesta COMPLETA del backend:', data);
        console.log('🔍 Tipo de dato:', typeof data);

        if (!data) {
          console.error('❌ La respuesta es NULL');
          return;
        }

        console.log('🔐 Token recibido:', data.token);

        if (!data.token) {
          console.error('❌ No viene el token en la respuesta');
          this.error = 'Token no recibido';
          return;
        }

        // Guardar token
        this.tokenService.login(data.token);

        console.log('✅ Token guardado correctamente');

      },
      error: (err: any) => {
        console.error('❌ ERROR COMPLETO:', err);
        console.error('📛 Status:', err.status);
        console.error('📛 Mensaje:', err.error);

        this.error = err.error?.message || 'Error en login';
      },
      complete: () => {
        console.log('🏁 Proceso de login finalizado');
      }
    });
  }
}