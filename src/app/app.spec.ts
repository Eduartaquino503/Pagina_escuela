import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { App } from './app';
import { ShortcutService } from './services/shortcut.service';
import { AuthService } from './auth/auth.service';

describe('App Component - Auditoría de Ciclo Raíz', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser un componente Standalone, lo importamos directamente aquí
      imports: [App],
      // CORREGIDO: Proveemos de forma limpia el entorno de enrutamiento y el cliente HTTP Mockeado
      // para satisfacer las dependencias internas del ShortcutService y AuthService
      providers: [
        ShortcutService,
        AuthService,
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create the app - Instanciación del componente raíz exitosa', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // Verifica que el árbol de componentes inicie de forma correcta sin colgarse
    expect(app).toBeTruthy();
  });

  it('should structural render the router outlet - Caja de paso del enrutador activa', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    /**
     * CORREGIDO: Evaluamos la realidad de tu app.html. 
     * Como removimos el código muerto autogenerado para dar paso al enrutador dinámico,
     * la prueba válida y estricta debe asegurar la existencia del <router-outlet>
     */
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});