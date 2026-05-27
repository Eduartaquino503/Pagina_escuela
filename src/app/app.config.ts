import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http'; // Importación necesaria para el HP Server

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita las peticiones HTTP para conectar con Payara 6 en el HP Server
    provideHttpClient(),

    // Optimiza la detección de cambios para un mejor rendimiento
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configuración avanzada de rutas
    provideRouter(
      routes, 
      withComponentInputBinding(), 
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Soporte para Hydration y renderizado híbrido
    provideClientHydration(withEventReplay()),

    // Necesario para los modales de edición y transiciones de la Escuela Walter
    provideAnimations()
  ]
};