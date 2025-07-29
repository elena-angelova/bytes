import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfileDetailsFormComponent } from "./profile-details-form";

describe("ProfileDetailsForm", () => {
  let component: ProfileDetailsFormComponent;
  let fixture: ComponentFixture<ProfileDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
