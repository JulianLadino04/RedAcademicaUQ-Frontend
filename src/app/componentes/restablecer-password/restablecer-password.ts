import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../servicios/auth';
import Swal from 'sweetalert2';
import { RestablecerPasswordDTO } from '../../dto/cuenta/restablecer-password.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './restablecer-password.html',
  styleUrl: './restablecer-password.css'
})
export class RestablecerPassword implements OnInit {
  restablecerForm!: FormGroup;
  cargando = false;
  mostrarPassword = false;
  mostrarConfirm = false;
  email: string = '';
  codigo: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    // Obtener el email y código de la sesión
    this.email = sessionStorage.getItem('recovery_email') || '';
    this.codigo = sessionStorage.getItem('recovery_codigo') || '';

    if (!this.email || !this.codigo) {
      Swal.fire('Error', 'Debes verificar el código primero', 'error');
      this.router.navigate(['/verificar-codigo']);
    }
  }

  private crearFormulario() {
    this.restablecerForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsCoinciden }
    );
  }

  private passwordsCoinciden(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  public restablecerPassword() {
    if (this.restablecerForm.invalid) {
      Swal.fire('Error', 'Por favor completa el formulario correctamente', 'error');
      return;
    }

    this.cargando = true;
    const restablecerDTO: RestablecerPasswordDTO = {
      email: this.email,
      codigo: this.codigo,
      passwordNueva: this.restablecerForm.get('password')?.value
    };

    this.authService.restablecerPassword(restablecerDTO).subscribe({
      next: (data) => {
        this.cargando = false;
        Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
        // Limpiar la sesión
        sessionStorage.removeItem('recovery_email');
        sessionStorage.removeItem('recovery_codigo');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.cargando = false;
        const mensaje = error.error?.mensaje || 'Error al actualizar la contraseña';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  public toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  public toggleMostrarConfirm() {
    this.mostrarConfirm = !this.mostrarConfirm;
  }
}
