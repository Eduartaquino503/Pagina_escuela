import { Injectable } from "@angular/core";

export interface InfoPagina {
  quienesSomos: string;
  mision: string;
  vision: string;
}

@Injectable({
  providedIn: 'root'
})
export class InfoLocal {
  private readonly storageKey = 'infoPaginaPrincipal';
  
  // Textos oficiales del Complejo Educativo Walter A. Soundy (Santa Tecla)
  private readonly datosDefault: InfoPagina = {
    quienesSomos: 'El Complejo Educativo Walter A. Soundy es una institución pública ubicada en la colonia Santa Mónica, Santa Tecla. A lo largo de los años, ha sido un pilar en la formación académica de la comunidad, brindando educación a estudiantes de diferentes niveles y contribuyendo al desarrollo social de la zona.',
    mision: 'Brindar educación integral de calidad que contribuya al desarrollo académico, social y humano de los estudiantes, fomentando valores y compromiso con la comunidad.',
    vision: 'Ser una institución educativa reconocida por su excelencia académica y formación integral, adaptándose a las necesidades de la sociedad moderna.'
  };

  constructor() { }

  /**
   * Recupera la información del LocalStorage. 
   * Actúa como capa de persistencia offline o caché secundaria.
   */
  obtenerInfo(): InfoPagina {
    try {
      const infoGuardada = localStorage.getItem(this.storageKey);
      if (infoGuardada) {
        return JSON.parse(infoGuardada) as InfoPagina;
      }
    } catch (e) {
      console.error("[InfoLocal] Error al parsear la caché local de contingencia:", e);
    }
    return this.getDatosDefault();
  }

  /**
   * Resguarda los textos en el navegador para acceso inmediato sin red.
   */
  guardarInfo(info: InfoPagina): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(info));
    } catch (e) {
      console.error("[InfoLocal] No se pudo escribir en el LocalStorage:", e);
    }
  }

  /**
   * Limpia el almacenamiento local para forzar la recarga desde MySQL.
   */
  restaurarDefault(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Getter público para recuperar los textos duros de respaldo institucional
   * en caso de caída del Servidor HP o del Túnel Cloudflare.
   */
  getDatosDefault(): InfoPagina {
    return { ...this.datosDefault };
  }
}