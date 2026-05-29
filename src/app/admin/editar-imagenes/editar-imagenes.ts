import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  MultimediaService,
  Multimedia,
} from "../../services/multimedia.service";

@Component({
  selector: "app-editar-imagenes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./editar-imagenes.html",
  styleUrl: "./editar-imagenes.css",
})
export class EditarImagenes implements OnInit {
  // Forzar al navegador a refrescar la imagen dinámicamente sin cachear
  cacheBuster: number = Date.now();

  tabActiva: string = "grados";
  seccionSeleccionada: string = "mision";
  sliderSeleccionado: string = "slider1";

  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

  // ARREGLOS DE DATOS UNIFICADOS PARA LOS BUCLES (*ngFor)
  imagenes: Multimedia[] = [];
  sliderImages: Multimedia[] = [];
  imagenesGaleria: Multimedia[] = []; // Reparado para acoplarse con el HTML

  constructor(private multimediaService: MultimediaService) {}

  ngOnInit(): void {
    this.cargarImagenes();
  }

  // ==========================================
  // 1. CARGA Y FILTRADO EXACTO DE LA BD
  // ==========================================
  cargarImagenes(): void {
    this.multimediaService.getImagenes().subscribe({
      next: (data: Multimedia[]) => {
        if (data && Array.isArray(data)) {
          // Identidad: 'mision', 'vision' o 'about'
          this.imagenes = data.filter(
            (img) => img && (
              img.seccion === "mision" ||
              img.seccion === "vision" ||
              img.seccion === "about"
            )
          );

          // Slider / Carrusel: 'slider1', 'slider2' o 'slider3'
          this.sliderImages = data.filter(
            (img) => img && (
              img.seccion === "slider1" ||
              img.seccion === "slider2" ||
              img.seccion === "slider3"
            )
          );

          // Galería: Capturamos los registros de la sección de fotos
          this.imagenesGaleria = data.filter(
            (img) => img && img.seccion && (img.seccion === "galeria" || img.seccion.toLowerCase().startsWith("galeria"))
          );

          console.log("IDENTIDAD FILTRADA:", this.imagenes);
          console.log("SLIDER FILTRADO:", this.sliderImages);
          console.log("GALERIA FILTRADA:", this.imagenesGaleria);
        }
      },
      error: (err) => {
        console.error("[EditarImagenes] Error cargando imágenes desde la API:", err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.imagenSeleccionada = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ==========================================
  // 2. GUARDAR IMAGEN (Estructurado JSON)
  // ==========================================
  guardarImagen(): void {
    if (!this.imagenSeleccionada) {
      console.log("No hay imagen seleccionada");
      return;
    }

    let seccion = this.seccionSeleccionada;

    // Evaluación limpia de la pestaña activa utilizando la variable corregida
    if (this.tabActiva === "galeria") {
      if (this.imagenesGaleria.length >= 8) {
        alert("Máximo 8 imágenes permitidas en la galería");
        return;
      }
      seccion = "galeria";
    }

    if (this.tabActiva === "slider") {
      seccion = this.sliderSeleccionado;
    }

    console.log("SECCION DETERMINADA A ENVIAR:", seccion);

    this.multimediaService
      .subirImagen(seccion, this.imagenSeleccionada)
      .subscribe({
        next: (res) => {
          alert("✅ Imagen subida correctamente al Servidor HP");
          this.cacheBuster = Date.now(); 
          this.limpiarFormularioImagen();
          this.cargarImagenes();
        },
        error: (err) => {
          console.error("[EditarImagenes] Error en la subida multimedia:", err);
          alert("Error subiendo imagen al servidor");
        },
      });
  }

  limpiarFormularioImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    const inputs = document.querySelectorAll('input[type="file"]');
    inputs.forEach((input: any) => input.value = '');
  }

  // ==========================================
  // 3. RENDERIZACIÓN SEGURA DE URLS (PRODUCCIÓN)
  // ==========================================
  getImageUrl(nombre: string): string {
    if (!nombre) {
      return "Imagenes/placeholder.jpg";
    }
    // Corregida la URL base para apuntar directo al endpoint mapeado por el túnel Cloudflare
    return `https://api.oseaquino-proyectos.uk/api/multimedia/archivo/${nombre}?cb=${this.cacheBuster}`;
  }

  // ==========================================
  // 4. ELIMINAR REGISTRO MULTIMEDIA
  // ==========================================
  eliminarImagen(id: number): void {
    if (!id) return;
    
    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta imagen?");
    if (!confirmar) return;

    this.multimediaService.eliminarImagen(id).subscribe({
      next: () => {
        console.log("Imagen eliminada de la BD y del almacenamiento");
        this.cargarImagenes();
      },
      error: (err) => {
        console.error("[EditarImagenes] Error eliminando multimedia:", err);
        alert("Error al intentar borrar la imagen");
      },
    });
  }

  getSlider(nombre: string): Multimedia | undefined {
    return this.sliderImages.find((img) => img && img.seccion === nombre);
  }
}