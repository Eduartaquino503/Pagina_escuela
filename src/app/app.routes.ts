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
  // ========== RUTAS PÚBLICAS ==========
  { path: '', component: PaginaPrincipalComponent },
  { path: 'inicio', component: PaginaPrincipalComponent },
  { path: 'oferta-academica', component: OfertaAcademica },
  
  // ========== LOGIN ==========
  { path: 'login', component: LoginComponent },
  
  // ========== PANEL DE ADMINISTRACIÓN (protegido) ==========
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: 'editar-info', component: EditorInfo },
      { path: 'editar-grados', component: EditarGrados },
      { path: 'editar-imagenes', component: EditarImagenes },
      { path: 'editar-footer', component: EditarFooter },
      { path: '', redirectTo: 'editar-info', pathMatch: 'full' }
    ]
  },
  
  // ========== REDIRECCIÓN PARA RUTAS NO ENCONTRADAS ==========
  { path: '**', redirectTo: '' }
];