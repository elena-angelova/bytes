import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MenuDropdownComponent } from "./menu-dropdown";

describe("MenuDropdown", () => {
  let component: MenuDropdownComponent;
  let fixture: ComponentFixture<MenuDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
