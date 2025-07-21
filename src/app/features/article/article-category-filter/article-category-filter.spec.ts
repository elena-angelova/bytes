import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleCategoryFilterComponent } from "./article-category-filter";

describe("ArticleCategoryFilter", () => {
  let component: ArticleCategoryFilterComponent;
  let fixture: ComponentFixture<ArticleCategoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCategoryFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
