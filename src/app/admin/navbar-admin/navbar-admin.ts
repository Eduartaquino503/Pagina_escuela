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
   * Obtiene el nombre del usuario autenticado. 
   * Si no hay información disponible en el servicio, retorna 'Administrador'.
   */
  get userName(): string {
    return this.authService.user()?.name || 'Administrador';
  }
  
  /**
   * Finaliza la sesión del usuario y redirige a la página pública de login.
   */
  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }
  }
}