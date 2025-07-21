import { Component, OnInit } from "@angular/core";
import { Article } from "../../types";
import { ArticlesService } from "../../services/articles.service";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { ArticleCategoryFilterComponent } from "../../features/article/article-category-filter/article-category-filter";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { LoaderComponent } from "../../ui/loader/loader";

@Component({
  selector: "app-articles",
  imports: [
    ArticleCategoryFilterComponent,
    ArticleGridComponent,
    LoaderComponent,
  ],
  templateUrl: "./articles.html",
  styleUrl: "./articles.css",
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  isMenuOpened: boolean = false;
  isLoading: boolean = true;

  constructor(
    private articleService: ArticlesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService
      .getArticles()
      .pipe(tap(() => (this.isLoading = false)))
      .subscribe({
        next: (articles) => (this.articles = articles),
        error: (err) => console.error(err), //! Add error handling
      });
  }

  onFilter(category: string) {
    this.router.navigate(["/category", category]);
  }

  onAuthorClick(authorId: string) {
    this.router.navigate(["/users", authorId]);
  }

  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
