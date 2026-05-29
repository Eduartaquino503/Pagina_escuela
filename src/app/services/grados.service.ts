import { Injectable, inject } from "@angular/core";
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
  private http = inject(HttpClient);
  private readonly apiUrl = "https://api.oseaquino-proyectos.uk/api/grados";

  getGrados(): Observable<Grado[]> {
    return this.http.get<Grado[]>(this.apiUrl, { withCredentials: true });
  }

  crearGrado(grado: Grado): Observable<any> {
    return this.http.post(this.apiUrl, grado, { withCredentials: true });
  }

  actualizarGrado(id: number, grado: Grado): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, grado, { withCredentials: true });
  }

  eliminarGrado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}