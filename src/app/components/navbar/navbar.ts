import { Component, HostListener, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
})
export class Navbar {
  private router = inject(Router);

  /**
   * INTERCEPTOR DE TECLADO (Atajo de Seguridad)
   * Escucha globalmente la combinación Ctrl + Shift + L para saltar
   * de forma inmediata hacia el panel de inicio de sesión administrativo.
   */
  @HostListener("window:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Validar combinación segura: Ctrl + Shift + L
    if (event.ctrlKey && event.shiftKey && (event.key === "L" || event.key === "l")) {
      event.preventDefault(); // Detener comportamientos nativos del navegador
      console.log("[ShortcutService] Atajo activado. Redireccionando a Login...");
      this.router.navigateByUrl("/login");
    }
  }
}