import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleHeaderFormComponent } from "./article-header-form";

describe("ArticleHeaderFormComponent", () => {
  let component: ArticleHeaderFormComponent;
  let fixture: ComponentFixture<ArticleHeaderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleHeaderFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleHeaderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
