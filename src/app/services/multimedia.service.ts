import { Injectable } from "@angular/core";
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
  // Solo cambiamos esta línea: de localhost a tu subdominio seguro de Cloudflare
  private apiUrl = "https://api.oseaquino-proyectos.uk/cewas-backend-1.0-SNAPSHOT/api/multimedia";

  constructor(private http: HttpClient) {}

  subirImagen(seccion: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("seccion", seccion);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getImagenes(): Observable<Multimedia[]> {
    return this.http.get<Multimedia[]>(this.apiUrl);
  }

  eliminarImagen(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}