import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShortcutService } from './services/shortcut.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /**
   * CORREGIDO: Declaramos e instanciamos el servicio como una propiedad de clase.
   * Al hacer esto fuera del constructor, Angular lo procesa en el momento exacto
   * del bootstrap global, activando el Listener del teclado de forma segura.
   */
  private readonly shortcutService = inject(ShortcutService);
}