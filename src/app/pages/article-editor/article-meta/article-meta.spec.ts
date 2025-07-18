import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleMeta } from './article-meta';

describe('ArticleMeta', () => {
  let component: ArticleMeta;
  let fixture: ComponentFixture<ArticleMeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleMeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleMeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
