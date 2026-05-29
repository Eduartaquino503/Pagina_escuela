import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  /**
   * CASO 1: Excluimos explícitamente el panel administrativo del pre-renderizado.
   * Las rutas de administración y el login necesitan evaluar tokens y sesiones en vivo,
   * por lo que deben procesarse bajo demanda en el cliente/servidor.
   */
  {
    path: 'login',
    renderMode: RenderMode.Server // Renderizado dinámico en vivo
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server // Protege todo el sub-árbol administrativo
  },

  /**
   * CASO 2: Comodín global para el portal público (Inicio, Oferta Académica, etc.).
   * Compila las páginas como archivos HTML puros y estáticos durante el build
   * para garantizar velocidad máxima de Nginx en el Servidor HP.
   */
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];