import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export interface SessionUser {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  usuarioID: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Se modifica esta línea para producción en el Server-HP apuntando al túnel de la API
  private apiUrl = "https://api.oseaquino-proyectos.uk/cewas-backend-1.0-SNAPSHOT/api/auth";

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((user: any) => {
          localStorage.setItem("usuario", JSON.stringify(user));
        }),
      );
  }

  logout() {
    localStorage.removeItem("usuario");
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("usuario") != null;
  }

  getUser() {
    return JSON.parse(localStorage.getItem("usuario") || "{}");
  }

  user() {
    return this.getUser();
  }
}