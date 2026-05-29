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
    tipo: "GRADO", // Alinhado con el DEFAULT del script SQL
  };

  constructor(private gradoService: GradoService) {}

  ngOnInit(): void {
    this.cargarGrados();
  }

  // ==========================================
  // CARGAR REGISTROS DESDE EL BACKEND
  // ==========================================
  cargarGrados(): void {
    this.gradoService.getGrados().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.grados = data;
        }
      },
      error: (err) => {
        console.error("[EditarGrados] Error al descargar registros de Payara:", err);
        this.mensajeError = "Error cargando registros desde el Servidor HP";
      },
    });
  }

  // ==========================================
  // CONTROL DEL MODAL DE CREACIÓN
  // ==========================================
  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.nuevoGrado = {
      nombre: "",
      descripcion: "",
      activado: true,
      tipo: "GRADO",
    };
  }

  // ==========================================
  // CREAR NUEVO GRADO O TALLER
  // ==========================================
  crearGrado(): void {
    if (!this.nuevoGrado.nombre.trim()) {
      this.mensajeError = "El nombre del registro es obligatorio.";
      return;
    }

    // Forzar mayúsculas para que calce con las restricciones y búsquedas de MySQL
    const registroEnviar = {
      ...this.nuevoGrado,
      tipo: this.nuevoGrado.tipo.toUpperCase()
    };

    this.gradoService.crearGrado(registroEnviar).subscribe({
      next: () => {
        this.mensajeExito = "Registro creado exitosamente en el sistema";
        this.mensajeError = "";
        this.cargarGrados();
        this.cerrarModal();
        setTimeout(() => this.mensajeExito = "", 3000);
      },
      error: (err) => {
        console.error("[EditarGrados] Error al persistir el nuevo grado:", err);
        this.mensajeError = "Error creando registro en la base de datos";
      },
    });
  }

  // ==========================================
  // SELECCIONAR PARA EDICIÓN
  // ==========================================
  seleccionarGrado(grado: Grado): void {
    this.gradoSeleccionado = {
      ...grado,
      tipo: (grado.tipo || "GRADO").toUpperCase()
    };
  }

  // ==========================================
  // GUARDAR CAMBIOS (MERGE EN BD)
  // ==========================================
  guardarCambios(): void {
    if (!this.gradoSeleccionado || !this.gradoSeleccionado.id) {
      return;
    }

    // Homogeneizar la cadena antes del envío asíncrono
    const registroActualizar = {
      ...this.gradoSeleccionado,
      tipo: this.gradoSeleccionado.tipo.toUpperCase()
    };

    this.gradoService
      .actualizarGrado(this.gradoSeleccionado.id, registroActualizar)
      .subscribe({
        next: () => {
          this.mensajeExito = "Registro actualizado correctamente";
          this.mensajeError = "";
          this.gradoSeleccionado = null;
          this.cargarGrados();
          setTimeout(() => this.mensajeExito = "", 3000);
        },
        error: (err) => {
          console.error("[EditarGrados] Error al actualizar mediante merge:", err);
          this.mensajeError = "Error actualizando el registro en el Servidor HP";
        },
      });
  }

  // ==========================================
  // ELIMINAR REGISTRO
  // ==========================================
  eliminarGrado(grado: Grado): void {
    if (!grado.id) {
      return;
    }

    const confirmar = confirm(`¿Estás seguro de eliminar permanentemente "${grado.nombre}"?`);
    if (!confirmar) {
      return;
    }

    this.gradoService.eliminarGrado(grado.id).subscribe({
      next: () => {
        this.mensajeExito = "Registro eliminado del sistema de forma limpia";
        this.mensajeError = "";
        if (this.gradoSeleccionado?.id === grado.id) {
          this.gradoSeleccionado = null;
        }
        this.cargarGrados();
        setTimeout(() => this.mensajeExito = "", 3000);
      },
      error: (err) => {
        console.error("[EditarGrados] Error al remover fila de grados:", err);
        this.mensajeError = "Error eliminando el registro del sistema";
      },
    });
  }

  cancelarEdicion(): void {
    this.gradoSeleccionado = null;
  }

  // ==========================================
  // FILTROS DE RENDERIZADO DINÁMICO BLINDADOS
  // ==========================================
  get gradosAcademicos(): Grado[] {
    return this.grados.filter((g) => g && (g.tipo || "").toUpperCase() === "GRADO");
  }

  get talleres(): Grado[] {
    return this.grados.filter((g) => g && (g.tipo || "").toUpperCase() === "TALLER");
  }
}