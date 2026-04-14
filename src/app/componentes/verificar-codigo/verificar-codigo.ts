import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../servicios/auth';
import Swal from 'sweetalert2';
import { VerificarCodigoDTO } from '../../dto/cuenta/verificar-codigo.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar-codigo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './verificar-codigo.html',
  styleUrl: './verificar-codigo.css'
})
export class VerificarCodigo implements OnInit {
  codigoForm!: FormGroup;
  cargando = false;
  email: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    // Obtener el email de la sesión
    this.email = sessionStorage.getItem('recovery_email') || '';
    if (!this.email) {
      Swal.fire('Error', 'Debes solicitar la recuperación primero', 'error');
      this.router.navigate(['/recuperar-password']);
    }
  }

  private crearFormulario() {
    this.codigoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public verificarCodigo() {
    if (this.codigoForm.invalid) {
      Swal.fire('Error', 'Por favor ingresa el código de verificación', 'error');
      return;
    }

    this.cargando = true;
    const verificarDTO: VerificarCodigoDTO = {
      email: this.email,
      codigo: this.codigoForm.get('codigo')?.value
    };

    this.authService.verificarCodigo(verificarDTO).subscribe({
      next: (data) => {
        this.cargando = false;
        Swal.fire('Éxito', 'Código verificado correctamente', 'success');
        // Guardar el código en la sesión para usarlo en el siguiente paso
        sessionStorage.setItem('recovery_codigo', verificarDTO.codigo);
        this.router.navigate(['/restablecer-password']);
      },
      error: (error) => {
        this.cargando = false;
        const mensaje = error.error?.mensaje || 'Código inválido o expirado';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }

  public reenviarCodigo() {
    this.cargando = true;
    this.authService.recuperarPassword({ email: this.email }).subscribe({
      next: () => {
        this.cargando = false;
        Swal.fire('Éxito', 'Se ha reenviado el código a tu correo', 'success');
      },
      error: (error) => {
        this.cargando = false;
        const mensaje = error.error?.mensaje || 'Error al reenviar el código';
        Swal.fire('Error', mensaje, 'error');
      }
    });
  }
}
