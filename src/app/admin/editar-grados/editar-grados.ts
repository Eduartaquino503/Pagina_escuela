import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { GradoService, Grado } from "../../services/grados.service";

@Component({
  selector: "app-editar-grados",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./editar-grados.html",
  styleUrls: ["./editar-grados.css"],
})
export class EditarGrados implements OnInit {
  grados: Grado[] = [];

  gradoSeleccionado: Grado | null = null;

  mostrarModal = false;

  mensajeExito = "";

  mensajeError = "";

  nuevoGrado: Grado = {
    nombre: "",
    descripcion: "",
    activado: true,
    tipo: "grado",
  };

  constructor(private gradoService: GradoService) {}

  ngOnInit(): void {
    this.cargarGrados();
  }

  // =========================
  // CARGAR
  // =========================
  cargarGrados(): void {
    this.gradoService.getGrados().subscribe({
      next: (data) => {
        this.grados = data;
      },

      error: (err) => {
        console.error(err);

        this.mensajeError = "Error cargando registros";
      },
    });
  }

  // =========================
  // MODAL
  // =========================
  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;

    this.nuevoGrado = {
      nombre: "",
      descripcion: "",
      activado: true,
      tipo: "grado",
    };
  }

  // =========================
  // CREAR
  // =========================
  crearGrado(): void {
    this.gradoService.crearGrado(this.nuevoGrado).subscribe({
      next: () => {
        this.mensajeExito = "Registro creado";

        this.cargarGrados();

        this.cerrarModal();
      },

      error: (err) => {
        console.error(err);

        this.mensajeError = "Error creando registro";
      },
    });
  }

  // =========================
  // SELECCIONAR
  // =========================
  seleccionarGrado(grado: Grado): void {
    this.gradoSeleccionado = {
      ...grado,
    };
  }

  // =========================
  // GUARDAR
  // =========================
  guardarCambios(): void {
    if (!this.gradoSeleccionado?.id) {
      return;
    }

    this.gradoService
      .actualizarGrado(this.gradoSeleccionado.id, this.gradoSeleccionado)
      .subscribe({
        next: () => {
          this.mensajeExito = "Registro actualizado";

          this.gradoSeleccionado = null;

          this.cargarGrados();
        },

        error: (err) => {
          console.error(err);

          this.mensajeError = "Error actualizando";
        },
      });
  }

  // =========================
  // ELIMINAR
  // =========================
  eliminarGrado(grado: Grado): void {
    if (!grado.id) {
      return;
    }

    const confirmar = confirm(`¿Eliminar ${grado.nombre}?`);

    if (!confirmar) {
      return;
    }

    this.gradoService.eliminarGrado(grado.id).subscribe({
      next: () => {
        this.mensajeExito = "Registro eliminado";

        this.cargarGrados();
      },

      error: (err) => {
        console.error(err);

        this.mensajeError = "Error eliminando";
      },
    });
  }

  cancelarEdicion(): void {
    this.gradoSeleccionado = null;
  }

  // =========================
  // FILTROS
  // =========================
  get gradosAcademicos(): Grado[] {
    return this.grados.filter((g) => (g.tipo || "").toLowerCase() === "grado");
  }

  get talleres(): Grado[] {
    return this.grados.filter((g) => (g.tipo || "").toLowerCase() === "taller");
  }
}
