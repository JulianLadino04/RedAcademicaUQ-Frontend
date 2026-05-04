import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../servicios/auth';
import Swal from 'sweetalert2';
import { RestablecerPasswordDTO } from '../../dto/cuenta/restablecer-password.dto';

@Component({
  selector: 'app-cambiar-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css',
})
export class CambiarPassword {
   registroForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: Auth) { 
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      codigoVerificacion: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      passwordNueva: ['', [Validators.required, Validators.maxLength(10)]],
      correo: ['', [Validators.required, Validators.email]],
    })
  }

  public cambiarPassword() {
    // Suponemos que el formulario contiene un campo para la nueva contraseña
    const RestablecerPasswordDTO = this.registroForm.value as RestablecerPasswordDTO;
  
    this.auth.restablecerPassword(RestablecerPasswordDTO).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Contraseña cambiada',
          text: 'La contraseña se ha cambiado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta || 'Ocurrió un error al cambiar la contraseña',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  public volver(){
    this.router.navigate(['/enviar-codigo']);
   }
}
