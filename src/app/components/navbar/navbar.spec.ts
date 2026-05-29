import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Navbar } from "./navbar";
import { provideRouter } from "@angular/router";

describe("Navbar Component - Auditoría de Calidad", () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])] 
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should create - Instanciación de componente correcta", () => {
    expect(component).toBeTruthy();
  });

  it("should have access to the administrative shortcut logic - Atajo Ctrl+Shift+L disponible", () => {
    // Ahora pasará limpio porque el método HostListener ya está declarado
    expect(component.handleKeyboardEvent).toBeDefined();
  });
});