import { Component, OnInit, inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Navbar } from "../navbar/navbar";
import { FooterComponent } from "../footer/footer.component";

import {
  InstitucionService,
  InstitucionConfig,
} from "../../services/institucion.service";

import {
  MultimediaService,
  Multimedia,
} from "../../services/multimedia.service";

import { InfoLocal } from "../../services/info-local"; 

@Component({
  selector: "app-pagina-principal",
  standalone: true,
  imports: [Navbar, FooterComponent, CommonModule, RouterModule],
  templateUrl: "./pagina-principal.html",
  styleUrls: ["./pagina-principal.css"],
})
export class PaginaPrincipalComponent implements OnInit {
  private institucionService = inject(InstitucionService);
  private multimediaService = inject(MultimediaService);
  private infoLocal = inject(InfoLocal); 
  private cdr = inject(ChangeDetectorRef);

  // DATOS INSTITUCIÓN (Estado inicial limpio)
  datos: InstitucionConfig = {
    id_config: 0,
    mision: "",
    vision: "",
    quienesSomos: "",
  };

  // MAPA MULTIMEDIA DINÁMICO
  imagenes: any = {};

  // ARREGLO DE GALERÍA Y CAROUSEL UNIFICADO
  imagenesGaleria: Multimedia[] = [];

  ngOnInit(): void {
    this.cargarDatosInstitucion();
    this.cargarGaleriaMultimedia();
  }

  /**
   * Obtiene la configuración de textos almacenados en MySQL (Túnel Cloudflare).
   */
  cargarDatosInstitucion(): void {
    this.institucionService.getInstitucion().subscribe({
      next: (res: InstitucionConfig) => {
        if (res) {
          this.datos = res;
        }
      },
      error: (err) => {
        console.error("[PaginaPrincipal] Servidor HP inaccesible. Activando textos de contingencia local...", err);
        const respaldo = this.infoLocal.obtenerInfo();
        this.datos = {
          id_config: 1,
          quienesSomos: respaldo.quienesSomos,
          mision: respaldo.mision,
          vision: respaldo.vision
        };
      },
    });
  }

  /**
   * Sincroniza el mapa de imágenes institucionales evitando bucles infinitos de repintado.
   */
  cargarGaleriaMultimedia(): void {
    this.multimediaService.getImagenes().subscribe({
      next: (res: Multimedia[]) => {
        if (res && Array.isArray(res)) {
          const mapaTemporal: any = {};
          
          res.forEach((img) => {
            if (img && img.seccion) {
              // Forzar minúsculas en la llave de control para asegurar acoplamiento con el HTML
              mapaTemporal[img.seccion.toLowerCase()] = img.ruta_archivo;
            }
          });
          
          // Asignación en lote limpia (Angular detectará el cambio de estado de manera nativa y suave)
          this.imagenes = mapaTemporal;

          // CORREGIDO: Filtro tolerante que acepta tanto 'galeria' como tus nuevos registros 'slider1', 'slider2', etc.
          this.imagenesGaleria = res
            .filter((img) => {
              if (!img || !img.ruta_archivo || !img.seccion) return false;
              const sec = img.seccion.toLowerCase();
              return sec.startsWith("galeria") || sec.startsWith("slider");
            })
            .slice(0, 8);
        }
      },
      error: (err) => {
        console.error("[PaginaPrincipal] Error al sincronizar imágenes del Servidor HP:", err);
      },
    });
  }

  /**
   * Helper unificado para resolver la ruta de archivos de diseño vs dinámicos.
   * Resuelve fallos de CamelCase y previene excepciones de cadena indefinida.
   */
  getImageUrl(nombre: string): string {
    if (!nombre || typeof nombre !== 'string') {
      return 'Imagenes/placeholder.jpg'; 
    }

    const nombreMinuscula = nombre.toLowerCase();
    const imagenesDiseno = ['default-about.jpg', 'escmodern.jpg', 'placeholder.jpg', 'about.jpg', 'clases.jpg'];

    // Si coincide con los archivos base empaquetadas en tu web.zip
    if (imagenesDiseno.includes(nombreMinuscula)) {
      if (nombreMinuscula === 'escmodern.jpg') {
        return 'Imagenes/EscuelaModerna.jpg';
      }
      return 'Imagenes/' + nombre;
    }

    // Si es una imagen subida dinámicamente desde el volumen del administrador
    return `https://api.oseaquino-proyectos.uk/api/multimedia/archivo/${nombre}`;
  }

  scrollTop(): void {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}