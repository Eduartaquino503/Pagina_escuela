import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guardián de Seguridad Funcional para el Área Administrativa (CEWAS)
 * Protege las rutas de administración contra accesos no autenticados y
 * preserva la URL de origen para redirecciones posteriores al Login.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Validar si el usuario cuenta con una sesión activa en el navegador
  if (authService.isAuthenticated()) {
    return true; // Acceso concedido de forma limpia
  }

  // 2. Si no está autenticado, interceptar la navegación y despacharlo al Login guardando la ruta objetivo
  console.warn(`[AuthGuard] Acceso denegado a: ${state.url}. Redireccionando a Login...`);
  
  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url },
  });
};