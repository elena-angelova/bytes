import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleDetailsComponent } from "./article-details";

describe("ArticleDetails", () => {
  let component: ArticleDetailsComponent;
  let fixture: ComponentFixture<ArticleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
