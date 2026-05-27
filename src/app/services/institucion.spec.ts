import { TestBed } from "@angular/core/testing";

import { Institucion } from "./institucion";

describe("Institucion", () => {
  let service: Institucion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Institucion);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
