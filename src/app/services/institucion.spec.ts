import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";

import { InstitucionService } from "./institucion.service"; // CORREGIDO: Importación con el nombre exacto de tu clase

describe("InstitucionService - Auditoría de Pruebas Unitarias", () => {
  let service: InstitucionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // CORREGIDO: Proveemos de forma limpia el cliente HTTP y su entorno de simulación (Testing) para Standalone
      providers: [
        InstitucionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    // Inyectamos el servicio bajo prueba y el controlador de peticiones mockeadas
    service = TestBed.inject(InstitucionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Gancho de limpieza preventiva tras ejecutar cada test unitario
  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones HTTP colgadas o abiertas
  });

  it("should be created - Instanciación exitosa del servicio", () => {
    expect(service).toBeTruthy();
  });

  it("should have getInstitucion method defined - Contrato de lectura verificado", () => {
    expect(service.getInstitucion).toBeDefined();
  });

  it("should have actualizarInstitucion method defined - Contrato de escritura verificado", () => {
    expect(service.actualizarInstitucion).toBeDefined();
  });
});