import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReadingListComponent } from "./reading-list";

describe("ReadingList", () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
