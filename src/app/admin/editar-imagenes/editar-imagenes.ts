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
  tabActiva: string = "grados";

  seccionSeleccionada: string = "mision";

  imagenSeleccionada!: File | null;

  imagenPreview: string | null = null;

  imagenes: Multimedia[] = [];

  sliderImages: any[] = [];

  galeriaImages: any[] = [];

  constructor(private multimediaService: MultimediaService) {}

  ngOnInit(): void {
    this.cargarImagenes();
  }

  cargarImagenes() {
    this.multimediaService.getImagenes().subscribe((data) => {
      this.imagenes = data;

      this.sliderImages = data.filter((img) => img.seccion === "slider");

      this.galeriaImages = data.filter((img) =>
        img.seccion.startsWith("galeria"),
      );
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.imagenSeleccionada = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagenPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  guardarImagen() {
    if (!this.imagenSeleccionada) {
      console.log("No hay imagen seleccionada");
      return;
    }

    let seccion = this.seccionSeleccionada;

    // ===== GALERÍA =====
    if (this.tabActiva === "galeria") {
      if (this.imagenesGaleria.length >= 8) {
        alert("Máximo 8 imágenes");
        return;
      }

      seccion = "galeria";
    }

    this.multimediaService.subirImagen(seccion, this.imagenSeleccionada)
    .subscribe({
      next: () => {
        this.cargarImagenes();
        this.limpiarFormularioImagen();
      }
    });

    // ===== SLIDER =====
    if (this.tabActiva === "slider") {
      seccion = "slider";
    }

    console.log("SECCION ENVIADA:", seccion);

    this.multimediaService
      .subirImagen(seccion, this.imagenSeleccionada)
      .subscribe({
        next: () => {
          console.log("Imagen guardada OK");

          this.limpiarFormularioImagen();

          this.cargarImagenes();
        },

        error: (err) => {
          console.error(err);
        },
      });
  }

  limpiarFormularioImagen() {
    this.imagenSeleccionada = null;

    this.imagenPreview = null;
  }

  getImageUrl(nombre: string): string {
    if (!nombre) {
      return "https://placehold.co/300x200?text=Sin+Imagen";
    }

    return "http://localhost:4200/Imagenes/" + nombre;
  }

  eliminarImagen(id: number) {
    this.multimediaService.eliminarImagen(id).subscribe({
      next: () => {
        this.cargarImagenes();
      },

      error: (err) => console.error(err),
    });
  }

  get imagenesGaleria(): Multimedia[] {
  return this.imagenes.filter(img => img.seccion === 'galeria');
}
}
