import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from
'@angular/forms';
import { CrearEstudianteDTO } from '../../dto/cuenta/crear-estudiante';
import { Auth } from '../../servicios/auth';
import Swal from 'sweetalert2';

@Component({
selector: 'app-registro',
standalone: true,
imports: [ReactiveFormsModule],
templateUrl: './registro.html',
styleUrl: './registro.css'
})

export class Registro{
registroForm!: FormGroup;
constructor(private formBuilder: FormBuilder, private authService: Auth) {
  this.crearFormulario();
 }

private crearFormulario() {
  this.registroForm = this.formBuilder.group({
  cedula: ['', [Validators.required]],
  nombre: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  direccion: ['', [Validators.required]],
  telefono: ['', [Validators.required, Validators.maxLength(10)]],
  password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
  confirmaPassword: ['', [Validators.required]]
  },
  { validators: this.passwordsMatchValidator } as AbstractControlOptions
);
}

passwordsMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('password')?.value;
  const confirmaPassword = formGroup.get('confirmaPassword')?.value;

  // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
  return password == confirmaPassword ? null : { passwordsMismatch: true };
}

public registrar() {
  if (this.registroForm.invalid) {
    this.registroForm.markAllAsTouched();
    Swal.fire({
      title: 'Formulario incompleto',
      text: 'Por favor completa correctamente todos los campos',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
    return;
  }

  const formValue = this.registroForm.value;
  const { confirmaPassword, ...crearEstudiante } = formValue;

  this.authService.crearCuenta(crearEstudiante as CrearEstudianteDTO).subscribe({
    next: () => {
      Swal.fire({
        title: 'Cuenta creada',
        text: 'La cuenta se ha creado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    },
    error: (error: any) => {
      Swal.fire({
        title: 'Error',
        text: error.error?.respuesta || error.error?.mensaje || 'No fue posible crear la cuenta',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}
}