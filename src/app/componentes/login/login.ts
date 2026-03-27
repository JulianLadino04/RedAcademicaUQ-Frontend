import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Auth } from '../../servicios/auth';
import Swal from 'sweetalert2';
import { LoginDTO } from '../../dto/login-dto';
import { Token } from '../../servicios/token';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: Auth, private tokenService: Token) {

    this.crearFormulario();
  }

  private crearFormulario() {

    this.loginForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required]]

    });

  }

  public login() {
      const loginDTO = this.loginForm.value as LoginDTO;
      this.authService.iniciarSesion(loginDTO).subscribe({
      next: (data) => {
        this.tokenService.login(data.respuesta.token);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta
        });
      },
    });
  }
}