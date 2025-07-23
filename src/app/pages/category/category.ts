import { Component, OnInit } from "@angular/core";
import { Article } from "../../types";
import { ArticlesService } from "../../services/articles.service";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs";
import { SectionTitleComponent } from "../../ui/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { EmptyStateComponent } from "../../ui/empty-state/empty-state";
import { LoaderComponent } from "../../ui/loader/loader";

@Component({
  selector: "app-category",
  imports: [
    SectionTitleComponent,
    ArticleGridComponent,
    EmptyStateComponent,
    LoaderComponent,
  ],
  templateUrl: "./category.html",
  styleUrl: "./category.css",
})
export class CategoryComponent implements OnInit {
  category!: string;
  articles: Article[] = [];
  isLoading: boolean = true;

  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get("category")!;

      this.articleService
        .getArticlesByCategory(this.category)
        .pipe(tap(() => (this.isLoading = false)))
        .subscribe({
          next: (articles) => (this.articles = articles),
          error: (err) => console.log(err), //! Add error handling
        });
    });
  }
}
