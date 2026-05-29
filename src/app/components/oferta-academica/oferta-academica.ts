import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Navbar } from "../navbar/navbar";
import { FooterComponent } from "../footer/footer.component";

import { GradoService, Grado } from "../../services/grados.service";

@Component({
  selector: "app-oferta-academica",
  standalone: true,
  imports: [CommonModule, Navbar, FooterComponent],
  templateUrl: "./oferta-academica.html",
  styleUrl: "./oferta-academica.css",
})
export class OfertaAcademica implements OnInit {
  gradosAcademicos: Grado[] = [];
  talleres: Grado[] = [];
  gradoSeleccionado: Grado | null = null;

  constructor(private gradoService: GradoService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Carga los datos desde la API del servidor HP a través del túnel Cloudflare
   * y los clasifica de forma reactiva alineándose con la sintaxis de MySQL.
   */
  cargarDatos(): void {
    this.gradoService.getGrados().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          // CORREGIDO: Homogeneizado a Mayúsculas para empalmar con el DEFAULT 'GRADO' de MySQL
          this.gradosAcademicos = data.filter(
            (g) => g && (g.tipo || "").toUpperCase() === "GRADO"
          );

          // CORREGIDO: Homogeneizado a Mayúsculas para empalmar con la persistencia real de la BD
          this.talleres = data.filter(
            (g) => g && (g.tipo || "").toUpperCase() === "TALLER"
          );
        }
      },
      error: (err) => {
        console.error("[OfertaAcademica] Error crítico al sincronizar con la API de Payara:", err);
      }
    });
  }

  /**
   * Conmutador interactivo (Toggle) para abrir o cerrar los requisitos
   * individuales de cada tarjeta de estudio.
   */
  abrirRequisitos(grado: Grado): void {
    this.gradoSeleccionado = this.gradoSeleccionado === grado ? null : grado;
  }
}