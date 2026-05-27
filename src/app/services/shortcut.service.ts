import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private isBrowser: boolean;

  private readonly SECRET_KEY = 'L';
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.initKeyboardListener();
    }
  }

  private initKeyboardListener(): void {
    // Solo ejecutar en el navegador, no en el servidor
    if (!this.isBrowser) return;
    
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // Detectar Ctrl + Shift + L
      if (event.ctrlKey && event.shiftKey && event.key === this.SECRET_KEY) {
        event.preventDefault();
        this.handleShortcut();
      }
    });
  }

  private handleShortcut(): void {
    // Solo ejecutar en el navegador
    if (!this.isBrowser) return;
    
    const currentUrl = this.router.url;
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdminRoute = currentUrl.startsWith('/admin');

    // Caso 1: Está en login → ir a página principal
    if (currentUrl === '/login') {
      this.router.navigate(['/']);
      return;
    }

    // Caso 2: Está en admin con sesión activa → ir a página principal
    if (isAdminRoute && isAuthenticated) {
      this.router.navigate(['/']);
      return;
    }

    // Caso 3: Está en página pública Y tiene sesión activa (admin logueado) → ir a admin
    if (!isAdminRoute && currentUrl !== '/login' && isAuthenticated) {
      this.router.navigate(['/admin/editar-info']);
      return;
    }

    // Caso 4: Está en página pública sin sesión → ir a login
    if (!isAdminRoute && currentUrl !== '/login' && !isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
  }
}