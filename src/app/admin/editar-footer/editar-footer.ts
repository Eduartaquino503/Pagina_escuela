import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-footer.html',
  styleUrls: ['./editar-footer.css']
})
export class EditarFooter implements OnInit {
  telefono: string = '';
  correo: string = '';
  telefonoOriginal: string = '';
  correoOriginal: string = '';
  
  telefonoPreview: string = '';
  correoPreview: string = '';
  hayCambiosSinGuardar: boolean = false;
  
  mensajeExito: string = '';
  mensajeError: string = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.telefono = localStorage.getItem('footer_telefono') || '2229-9067';
    this.correo = localStorage.getItem('footer_correo') || 'cewas2000@gmail.com';
    this.telefonoOriginal = this.telefono;
    this.correoOriginal = this.correo;
    this.actualizarVistaPrevia();
  }

  actualizarVistaPrevia(): void {
    this.telefonoPreview = this.telefono || '____-____';
    this.correoPreview = this.correo || 'correo@ejemplo.com';
    this.hayCambiosSinGuardar = (this.telefono !== this.telefonoOriginal) || 
                                 (this.correo !== this.correoOriginal);
  }

  onTelefonoInput(): void {
    let num = this.telefono.replace(/\D/g, '');
    if (num.length > 4) {
      num = num.substring(0, 4) + '-' + num.substring(4, 8);
    }
    this.telefono = num;
    this.actualizarVistaPrevia();
  }

  onTelefonoBlur(): void {
    const soloDigitos = this.telefono.replace(/\D/g, '');
    if (soloDigitos.length > 0 && soloDigitos.length !== 8) {
      this.mensajeError = 'El teléfono debe tener exactamente 8 dígitos.';
    } else {
      this.mensajeError = '';
    }
  }

  onCorreoBlur(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.correo && !emailRegex.test(this.correo)) {
      this.mensajeError = 'Por favor, ingresa un correo electrónico válido.';
    } else {
      this.mensajeError = '';
    }
  }

  guardarCambios(): void {
    if (this.mensajeError) return;

    localStorage.setItem('footer_telefono', this.telefono);
    localStorage.setItem('footer_correo', this.correo);
    
    this.telefonoOriginal = this.telefono;
    this.correoOriginal = this.correo;
    this.hayCambiosSinGuardar = false;
    
    this.mensajeExito = '✅ ¡Cambios guardados con éxito!';
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  cancelarCambios(): void {
    this.telefono = this.telefonoOriginal;
    this.correo = this.correoOriginal;
    this.mensajeError = '';
    this.actualizarVistaPrevia();
  }
}