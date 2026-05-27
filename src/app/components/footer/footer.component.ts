import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  telefono: string = '+503 2229-9067';
  correo: string = 'cewas2000@gmail.com';

  ngOnInit(): void {
    this.cargarDatosFooter();
  }

  // Escucha si hay cambios en el LocalStorage desde el Panel Administrativo
  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'footer_telefono' || event.key === 'footer_correo') {
      this.cargarDatosFooter();
    }
  }

  cargarDatosFooter(): void {
    const telefonoGuardado = localStorage.getItem('footer_telefono');
    const correoGuardado = localStorage.getItem('footer_correo');
    
    // Si existen en el storage (editados por el módulo), los usamos. 
    // Si no, se mantienen los valores por defecto.
    if (telefonoGuardado) this.telefono = telefonoGuardado;
    if (correoGuardado) this.correo = correoGuardado;
  }
}