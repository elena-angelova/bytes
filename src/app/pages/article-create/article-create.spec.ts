import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleCreateComponent } from "./article-create";

describe("ArticleCreateComponent", () => {
  let component: ArticleCreateComponent;
  let fixture: ComponentFixture<ArticleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
