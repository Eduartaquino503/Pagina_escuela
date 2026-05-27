import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Grado {
  id?: number;
  nombre: string;
  descripcion: string;
  activado: boolean;
  tipo: string;
}

@Injectable({
  providedIn: "root",
})
export class GradoService {
  // Solo se modifica esta línea para producción en el Server-HP
  private apiUrl = "https://api.oseaquino-proyectos.uk/cewas-backend-1.0-SNAPSHOT/api/grados";

  constructor(private http: HttpClient) {}

  // =========================
  // GET
  // =========================
  getGrados(): Observable<Grado[]> {
    return this.http.get<Grado[]>(this.apiUrl);
  }

  // =========================
  // POST
  // =========================
  crearGrado(grado: Grado): Observable<any> {
    return this.http.post(this.apiUrl, grado);
  }

  // =========================
  // PUT
  // =========================
  actualizarGrado(
    id: number,
    grado: Grado
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      grado
    );
  }

  // =========================
  // DELETE
  // =========================
  eliminarGrado(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}