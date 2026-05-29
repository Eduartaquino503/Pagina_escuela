import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Multimedia {
  id_imagen: number;
  seccion: string;
  ruta_archivo: string;
  nombre_original: string;
}

@Injectable({
  providedIn: "root",
})
export class MultimediaService {
  private http = inject(HttpClient);
  private readonly apiUrl = "https://api.oseaquino-proyectos.uk/api/multimedia";

  subirImagen(seccion: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("seccion", seccion);
    return this.http.post(`${this.apiUrl}/upload`, formData, { withCredentials: true });
  }

  getImagenes(): Observable<Multimedia[]> {
    return this.http.get<Multimedia[]>(this.apiUrl, { withCredentials: true });
  }

  eliminarImagen(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}