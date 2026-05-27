import { Component, inject, HostListener } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
})
export class Navbar {
  private router = inject(Router);

  /**
   * Listener global para detectar el acceso al Panel Administrativo.
   * Combinación: Shift + Ctrl + L
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Verificamos la combinación Shift + Ctrl + L
    if (event.ctrlKey && event.shiftKey && (event.key === 'L' || event.key === 'l')) {
      event.preventDefault();
      
      // Verificamos si no estamos ya en la ruta de acceso
      if (this.router.url !== '/login') {
        console.log("Iniciando acceso administrativo...");
        this.router.navigate(['/login']);
      }
    }
  }
}