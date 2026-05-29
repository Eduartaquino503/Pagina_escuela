import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InstitucionService, InstitucionConfig } from '../../services/institucion.service';

@Component({
  selector: 'app-editar-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-info.html',
  styleUrls: ['./editar-info.css']
})
export class EditorInfo implements OnInit {
  private fb = inject(FormBuilder);
  private institucionService = inject(InstitucionService);
  
  infoForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  
  errorQuienesSomos: string = '';
  errorMision: string = '';
  errorVision: string = '';

  contadorQuienesSomos: number = 0;
  contadorMision: number = 0;
  contadorVision: number = 0;
  
  // CORREGIDO: Ampliado para que la historia institucional no bloquee el validador de Angular
  maxLength: number = 4000;
  idConfigActual: number = 1;

  constructor() {
    this.infoForm = this.fb.group({
      quienesSomos: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]],
      mision: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]],
      vision: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxLength)]]
    });
  }

  ngOnInit(): void {
    this.cargarDesdeServidor();
    this.escucharCambios();
  }

  cargarDesdeServidor(): void {
    this.institucionService.getInstitucion().subscribe({
      next: (info: InstitucionConfig) => {
        if (info) {
          this.idConfigActual = info.id_config || 1;
          this.infoForm.patchValue({
            quienesSomos: info.quienesSomos,
            mision: info.mision,
            vision: info.vision
          });
          this.actualizarContadores();
        }
      },
      error: (err: any) => {
        console.error('[EditorInfo] Error de conexión con la API de Payara:', err);
        this.mensajeError = '❌ Error de conexión con el Servidor HP a través del túnel.';
      }
    });
  }

  escucharCambios(): void {
    const campos = ['quienesSomos', 'mision', 'vision'];
    campos.forEach(campo => {
      this.infoForm.get(campo)?.valueChanges.subscribe(value => {
        const len = value?.length || 0;
        if (campo === 'quienesSomos') this.contadorQuienesSomos = len;
        if (campo === 'mision') this.contadorMision = len;
        if (campo === 'vision') this.contadorVision = len;
        this.validarCampo(campo);
      });
    });
  }

  actualizarContadores(): void {
    this.contadorQuienesSomos = this.infoForm.get('quienesSomos')?.value?.length || 0;
    this.contadorMision = this.infoForm.get('mision')?.value?.length || 0;
    this.contadorVision = this.infoForm.get('vision')?.value?.length || 0;
  }

  validarCampo(nombre: string): void {
    const control = this.infoForm.get(nombre);
    let msg = '';
    if (control?.invalid && (control?.touched || control?.dirty)) {
      if (control?.errors?.['required']) msg = '❌ Campo obligatorio.';
      else if (control?.errors?.['minlength']) msg = '❌ Mínimo 10 caracteres.';
      else if (control?.errors?.['maxlength']) msg = `❌ Máximo ${this.maxLength} caracteres.`;
    }
    if (nombre === 'quienesSomos') this.errorQuienesSomos = msg;
    if (nombre === 'mision') this.errorMision = msg;
    if (nombre === 'vision') this.errorVision = msg;
  }

  // CORREGIDO: Renombrado a un contexto semántico correcto
  onFieldBlur(campo: string): void {
    this.validarCampo(campo);
  }

  guardarCambios(): void {
    if (this.infoForm.valid) {
      const datos: InstitucionConfig = { 
        id_config: this.idConfigActual, 
        ...this.infoForm.value 
      };
      
      this.institucionService.actualizarInstitucion(datos).subscribe({
        next: () => {
          this.mensajeExito = '✅ Información actualizada en MySQL exitosamente.';
          this.mensajeError = '';
          this.cargarDesdeServidor(); // Refrescar estado limpio
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err: any) => {
          console.error('[EditorInfo] Error en la petición POST/PUT de persistencia:', err);
          this.mensajeError = '⚠️ Error al persistir cambios en el Server-HP.';
        }
      });
    }
  }
}