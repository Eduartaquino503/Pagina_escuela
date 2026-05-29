import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface InstitucionConfig {
  id_config: number;
  quienesSomos: string;
  mision: string;
  vision: string;
  telefono?: string;  
  correo?: string;    
}

@Injectable({
  providedIn: "root",
})
export class InstitucionService {
  private http = inject(HttpClient);
  private readonly apiUrl = "https://api.oseaquino-proyectos.uk/api/institucion";

  getInstitucion(): Observable<InstitucionConfig> {
    return this.http.get<InstitucionConfig>(this.apiUrl, { withCredentials: true });
  }

  actualizarInstitucion(datos: InstitucionConfig): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizar`, datos, { withCredentials: true });
  }

  getContacto(): Observable<{ telefono: string; correo: string }> {
    return this.http.get<{ telefono: string; correo: string }>(`${this.apiUrl}/contacto`, { withCredentials: true });
  }

  actualizarContacto(contacto: { telefono: string; correo: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contacto`, contacto, { withCredentials: true });
  }
}