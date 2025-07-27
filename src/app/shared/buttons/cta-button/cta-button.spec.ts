import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CtaButtonComponent } from "./cta-button";

describe("CtaButton", () => {
  let component: CtaButtonComponent;
  let fixture: ComponentFixture<CtaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
