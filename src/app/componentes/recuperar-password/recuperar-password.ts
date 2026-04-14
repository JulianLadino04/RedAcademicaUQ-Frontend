import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../servicios/auth';
import Swal from 'sweetalert2';
import { RecuperarPasswordDTO } from '../../dto/cuenta/recuperar-password.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css'
})
export class RecuperarPassword {
  recuperarForm!: FormGroup;
  cargando = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.recuperarForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public recuperarPassword() {
    if (this.recuperarForm.invalid) {
      Swal.fire('Error', 'Por favor completa el formulario correctamente', 'error');
      return;
    }

    this.cargando = true;
    const recuperarDTO = this.recuperarForm.value as RecuperarPasswordDTO;

    this.authService.recuperarPassword(recuperarDTO).subscribe({
      next: (data) => {
        this.cargando = false;
        Swal.fire('Éxito', 'Se ha enviado un código a tu correo electrónico', 'success');
        // Guardar el email en la sesión para usarlo en el siguiente paso
        sessionStorage.setItem('recovery_email', recuperarDTO.email);
        this.router.navigate(['/verificar-codigo']);
      },
      error: (error) => {
        this.cargando = false;
        const mensaje = error.error?.mensaje || 'Error al enviar el código de recuperación';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }
}
