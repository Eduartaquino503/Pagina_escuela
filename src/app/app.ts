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
  constructor() {
    // Inicializar el servicio de atajos de teclado
    inject(ShortcutService);
  }
}