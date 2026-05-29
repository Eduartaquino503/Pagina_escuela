import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css'
})
export class NavbarAdmin {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  /**
   * Obtiene el nombre del usuario autenticado de forma segura. 
   * Mapea con tolerancia el atributo real proveniente de tu entidad de Java (nombre_completo).
   */
  get userName(): string {
    const usuarioLogueado = this.authService.user;
    
    if (!usuarioLogueado) {
      return 'Administrador';
    }

    // BLINDAJE: Busca 'nombre_completo' (API), 'nombreCompleto' o 'name' como último recurso
    return usuarioLogueado.nombre_completo || 
           usuarioLogueado.nombreCompleto || 
           usuarioLogueado.name || 
           'Administrador';
  }
  
  /**
   * Finaliza la sesión del usuario y redirige a la página pública de login.
   */
  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión del sistema administrativo?')) {
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }
  }
}