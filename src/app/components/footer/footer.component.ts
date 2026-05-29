import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitucionService } from '../../services/institucion.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  private institucionService = inject(InstitucionService);

  telefono: string = '2229-9067';
  correo: string = 'cewas2000@gmail.com';

  ngOnInit(): void {
    this.cargarDatosFooter();
  }

  cargarDatosFooter(): void {
    // 🔥 CORREGIDO: Consume el método del servicio centralizado con withCredentials en lugar de llamadas crudas
    this.institucionService.getContacto().subscribe({
      next: (contacto) => {
        if (contacto) {
          this.telefono = contacto.telefono || '2229-9067';
          this.correo = contacto.correo || 'cewas2000@gmail.com';
          
          localStorage.setItem('footer_telefono', this.telefono);
          localStorage.setItem('footer_correo', this.correo);
        }
      },
      error: (err) => {
        console.warn('[Footer] Servidor HP inaccesible, activando respaldo local.', err);
        this.telefono = localStorage.getItem('footer_telefono') || '2229-9067';
        this.correo = localStorage.getItem('footer_correo') || 'cewas2000@gmail.com';
      }
    });
  }
}