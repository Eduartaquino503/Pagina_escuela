import { Component, OnInit, inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Navbar } from "../navbar/navbar";

import {
  InstitucionService,
  InstitucionConfig,
} from "../../services/institucion.service";

import {
  MultimediaService,
  Multimedia,
} from "../../services/multimedia.service";

@Component({
  selector: "app-pagina-principal",
  standalone: true,
  imports: [Navbar, CommonModule, RouterModule],
  templateUrl: "./pagina-principal.html",
  styleUrls: ["./pagina-principal.css"],
})
export class PaginaPrincipalComponent implements OnInit {
  private institucionService = inject(InstitucionService);
  private multimediaService = inject(MultimediaService);
  private cdr = inject(ChangeDetectorRef);

  // DATOS INSTITUCIÓN
  datos: InstitucionConfig = {
    id_config: 0,
    mision: "",
    vision: "",
    quienesSomos: "",
  };

  // IMÁGENES IDENTIDAD
  imagenes: any = {};

  // GALERÍA
  imagenesGaleria: Multimedia[] = [];

  ngOnInit(): void {
    // CARGAR DATOS
    this.institucionService.getInstitucion().subscribe({
      next: (res: InstitucionConfig) => {
        this.datos = res;
        this.cdr.detectChanges();
      },

      error: (err) => console.error("Error conectando al backend:", err),
    });

    // CARGAR IMÁGENES
    this.multimediaService.getImagenes().subscribe({
      next: (res: Multimedia[]) => {
        // mapa de imágenes generales (mision, vision, etc)
        res.forEach((img) => {
          this.imagenes[img.seccion] = "/Imagenes/" + img.ruta_archivo;
        });

        // 🔥 IMPORTANTE: asegurar máximo 8 y SOLO galería
        this.imagenesGaleria = res
          .filter((img) => img.seccion?.startsWith("galeria"))
          .slice(0, 8);

        console.log("GALERÍA CARGADA:", this.imagenesGaleria);
        console.log("TODAS LAS IMÁGENES:", res);
        console.log(
          "GALERÍA FILTRADA:",
          res.filter((img) => img.seccion === "galeria"),
        );

        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error cargando imágenes:", err),
    });
  }

  // HELPER URL
  getImageUrl(nombre: string): string {
    return "/Imagenes/" + nombre;
  }

  // BOTÓN SCROLL
  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
