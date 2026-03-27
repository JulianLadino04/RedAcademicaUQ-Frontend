import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from
'@angular/forms';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
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
  password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]]
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
  const crearCuenta = this.registroForm.value as CrearCuentaDTO;
  this.authService.crearCuenta(crearCuenta).subscribe({
  next: (data: any) => {
    Swal.fire({
      title: 'Cuenta creada',
      text: 'La cuenta se ha creado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
  },
  error: (error: any) => {
    Swal.fire({
      title: 'Error',
      text: error.error.respuesta,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }
});
}
}