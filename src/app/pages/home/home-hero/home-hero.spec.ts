import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeHeroComponent } from "./home-hero";

describe("HomeHero", () => {
  let component: HomeHeroComponent;
  let fixture: ComponentFixture<HomeHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
