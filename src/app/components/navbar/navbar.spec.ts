import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Navbar } from "./navbar";
import { provideRouter } from "@angular/router";

describe("Navbar", () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos el componente standalone y proveemos las rutas necesarias
      imports: [Navbar],
      providers: [provideRouter([])] 
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    
    // Esperamos a que el componente sea estable antes de las pruebas
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should create", () => {
    // Verifica que el componente se instancia correctamente
    expect(component).toBeTruthy();
  });

  it("should have access to the administrative shortcut logic", () => {
    // Verifica que la función del HostListener esté definida
    expect(component.handleKeyboardEvent).toBeDefined();
  });
});