import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// 🔥 DECLARACIÓN DIRECTA: Evita el error TS2307 al no depender de archivos externos
export interface UsuarioAutenticado {
  id?: number;
  id_usuario?: number;
  nombre_completo?: string;
  nombreCompleto?: string;
  name?: string;
  correo?: string;
  id_rol?: number;
  usuarioID?: string;
  rol?: string;
  activo?: boolean;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = "https://api.oseaquino-proyectos.uk/api/auth";

  login(email: string, password: string): Observable<UsuarioAutenticado> {
    return this.http.post<UsuarioAutenticado>(
      `${this.apiUrl}/login`, 
      { email, password },
      { withCredentials: true } // 🔥 Sincronizado estrictamente con el CorsFilter de Payara
    ).pipe(
      tap((user: UsuarioAutenticado) => {
        localStorage.setItem("usuario", JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem("usuario");
    localStorage.removeItem("footer_telefono");
    localStorage.removeItem("footer_correo");
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("usuario") !== null;
  }

  getUser(): UsuarioAutenticado {
    const session = localStorage.getItem("usuario");
    if (!session) return {};
    try {
      return JSON.parse(session) as UsuarioAutenticado;
    } catch (e) {
      return {};
    }
  }

  getUserRole(): string {
    return this.getUser()?.rol?.toLowerCase() || 'usuario';
  }

  hasRole(roleName: string): boolean {
    return this.getUserRole() === roleName.toLowerCase();
  }

  get user(): UsuarioAutenticado {
    return this.getUser();
  }
}