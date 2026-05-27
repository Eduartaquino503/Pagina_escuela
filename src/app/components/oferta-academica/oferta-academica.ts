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

  constructor(
    private gradoService: GradoService
  ) {}

  ngOnInit(): void {

    this.cargarDatos();
  }

  cargarDatos(): void {

    this.gradoService.getGrados().subscribe({

      next: (data) => {

        this.gradosAcademicos = data.filter(
          (g) => (g.tipo || "").toLowerCase() === "grado"
        );

        this.talleres = data.filter(
          (g) => (g.tipo || "").toLowerCase() === "taller"
        );
      },

      error: (err) => {
        console.error(err);
      }
    });
  }

  abrirRequisitos(grado: Grado): void {

    this.gradoSeleccionado =
      this.gradoSeleccionado === grado
        ? null
        : grado;
  }
}