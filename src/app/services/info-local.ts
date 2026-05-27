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
  private storageKey = 'infoPaginaPrincipal';
  
  private datosDefault: InfoPagina = {
    quienesSomos: 'El Complejo Educativo Walter A. Soundy es una institución pública ubicada en la colonia Santa Mónica, Santa Tecla. A lo largo de los años, ha sido un pilar en la formación académica de la comunidad, brindando educación a estudiantes de diferentes niveles y contribuyendo al desarrollo social de la zona.',
    mision: 'Brindar educación integral de calidad que contribuya al desarrollo académico, social y humano de los estudiantes, fomentando valores y compromiso con la comunidad.',
    vision: 'Ser una institución educativa reconocida por su excelencia académica y formación integral, adaptándose a las necesidades de la sociedad moderna.'
  };

  constructor() { }

  obtenerInfo(): InfoPagina {
    const infoGuardada = localStorage.getItem(this.storageKey);
    if (infoGuardada) {
      return JSON.parse(infoGuardada);
    }
    return this.datosDefault;
  }

  guardarInfo(info: InfoPagina): void {
    localStorage.setItem(this.storageKey, JSON.stringify(info));
  }

  restaurarDefault(): void {
    localStorage.removeItem(this.storageKey);
  }
}