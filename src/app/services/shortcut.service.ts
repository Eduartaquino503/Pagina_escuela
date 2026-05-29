import { Injectable, inject, Inject, PLATFORM_ID, RendererFactory2, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private rendererFactory = inject(RendererFactory2); // Fábrica nativa de renderizado de Angular
  
  private renderer!: Renderer2;
  private isBrowser: boolean;
  private listenerDestroyer: (() => void) | null = null;

  // Clave secreta estandarizada
  private readonly SECRET_KEY = 'l'; 
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      // Creamos un renderizador seguro para el contexto del navegador
      this.renderer = this.rendererFactory.createRenderer(null, null);
      this.initKeyboardListener();
    }
  }

  /**
   * Inicializa el escucha global del teclado de forma nativa utilizando el motor de Angular.
   * Evita duplicaciones de eventos durante el proceso de hidratación del cliente.
   */
  private initKeyboardListener(): void {
    if (!this.isBrowser || !this.renderer) return;
    
    // Si ya existía un escucha previo por un reinicio caliente, lo destruimos para evitar fugas
    if (this.listenerDestroyer) {
      this.listenerDestroyer();
    }

    // Escucha controlada por Angular: Retorna automáticamente una función de destrucción
    this.listenerDestroyer = this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      const keyPressed = event.key.toLowerCase();
      
      if (event.ctrlKey && event.shiftKey && keyPressed === this.SECRET_KEY) {
        event.preventDefault();
        this.handleShortcut();
      }
    });
  }

  /**
   * Máquina de estados inteligente para alternar los flujos de navegación (Toggle).
   */
  private handleShortcut(): void {
    if (!this.isBrowser) return;
    
    const currentUrl = this.router.url;
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdminRoute = currentUrl.startsWith('/admin');

    console.log(`[ShortcutService] Atajo activado de forma limpia. URL: ${currentUrl} | Autenticado: ${isAuthenticated}`);

    // Caso 1: Está en login → ir a la raíz del portal público
    if (currentUrl === '/login') {
      this.router.navigate(['/']);
      return;
    }

    // Caso 2: Está en el panel admin con sesión activa → ir a la raíz pública
    if (isAdminRoute && isAuthenticated) {
      this.router.navigate(['/']);
      return;
    }

    // Caso 3: Está en página pública Y tiene sesión activa (Admin logueado) → volver al panel administrativo
    if (!isAdminRoute && currentUrl !== '/login' && isAuthenticated) {
      this.router.navigate(['/admin/editar-info']);
      return;
    }

    // Caso 4: Está en página pública sin sesión activa → ir a la pantalla de autenticación
    if (!isAdminRoute && currentUrl !== '/login' && !isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
  }
}