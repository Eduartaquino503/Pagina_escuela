import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login.component';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { EditorInfo } from './admin/editar-info/editar-info';
import { EditarGrados } from './admin/editar-grados/editar-grados';
import { EditarImagenes } from './admin/editar-imagenes/editar-imagenes';
import { EditarFooter } from './admin/editar-footer/editar-footer';
import { PaginaPrincipalComponent } from './components/pagina-principal/pagina-principal';
import { OfertaAcademica } from './components/oferta-academica/oferta-academica';

export const routes: Routes = [
  // ========== RUTAS PÚBLICAS (Sincronizadas con Pre-renderizado) ==========
  /**
   * CORREGIDO: Redirigimos la raíz vacía hacia /inicio de forma estricta.
   * Esto unifica el tráfico de Nginx en un solo archivo estático indexado,
   * optimizando la caché del navegador y evitando duplicidad de compilación.
   */
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: PaginaPrincipalComponent },
  { path: 'oferta-academica', component: OfertaAcademica },
  
  // ========== LOGIN ==========
  { path: 'login', component: LoginComponent },
  
  // ========== PANEL DE ADMINISTRACIÓN (Protección por AuthGuard) ==========
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard], // Blindaje perimetral para el Layout y todos sus hijos
    children: [
      { path: 'editar-info', component: EditorInfo },
      { path: 'editar-grados', component: EditarGrados },
      { path: 'editar-imagenes', component: EditarImagenes },
      { path: 'editar-footer', component: EditarFooter },
      
      // Inicializador por defecto si el usuario accede a /admin a secas
      { path: '', redirectTo: 'editar-info', pathMatch: 'full' }
    ]
  },
  
  // ========== REDIRECCIÓN DE SEGURIDAD PARA RUTAS INEXISTENTES ==========
  { path: '**', redirectTo: 'inicio' }
];