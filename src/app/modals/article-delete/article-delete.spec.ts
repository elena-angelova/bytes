import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleDeleteModalComponent } from "./article-delete";

describe("ArticleDelete", () => {
  let component: ArticleDeleteModalComponent;
  let fixture: ComponentFixture<ArticleDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDeleteModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
