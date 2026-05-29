import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Definición estricta de la estructura de un ítem de navegación
interface MenuItem {
  nombre: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  /**
   * Lista inmutable de módulos de edición disponibles en el Panel Administrativo.
   * Las rutas coinciden de forma exacta con las definidas en app.routes.ts.
   */
  readonly menuItems: MenuItem[] = [
    { nombre: 'Información General', icono: '📝', ruta: '/admin/editar-info' },
    { nombre: 'Oferta Académica', icono: '🎓', ruta: '/admin/editar-grados' },
    { nombre: 'Contenido Multimedia', icono: '🖼️', ruta: '/admin/editar-imagenes' },
    { nombre: 'Pie de Página', icono: '📞', ruta: '/admin/editar-footer' }
  ];
}