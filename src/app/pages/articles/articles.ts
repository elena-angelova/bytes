import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Article } from "../../types";
import { ArticleService } from "../../services/article.service";
import { Router } from "@angular/router";
import { take } from "rxjs";
import { ArticleCategoryFilterComponent } from "../../features/article/article-category-filter/article-category-filter";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { LoaderComponent } from "../../shared/loader/loader";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";

@Component({
  selector: "app-articles",
  imports: [
    ArticleCategoryFilterComponent,
    ArticleGridComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./articles.html",
  styleUrl: "./articles.css",
})
export class ArticlesComponent implements OnInit, AfterViewInit {
  articles: Article[] = [];

  isMenuOpened: boolean = false;
  isLoading: boolean = true;
  isLoadingMore: boolean = false;
  hasMore: boolean = true;
  private readonly pageSize = 9;

  observer!: IntersectionObserver;

  @ViewChild("scrollAnchor") scrollAnchor!: ElementRef;

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.articleService.resetPagination();

    this.articleService
      .getArticles()
      .pipe(take(1))
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          this.isLoading = false;
          this.hasMore = articles.length === this.pageSize;

          setTimeout(() => {
            this.observer.observe(this.scrollAnchor.nativeElement);
          });
        },
        error: (err) => console.error(err), //! Add error handling
      });
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoadingMore) {
        this.loadMore();
      }
    });
  }

  //! Consider unsubsribing from the observables in ngOnDestroy
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  loadMore() {
    if (!this.hasMore || this.isLoadingMore) {
      return;
    }

    this.isLoadingMore = true;
    this.articleService
      .getArticles()
      .pipe(take(1))
      .subscribe({
        next: (newArticles) => {
          this.articles = [...this.articles, ...newArticles];
          this.isLoadingMore = false;
          this.hasMore = newArticles.length === this.pageSize;
        },
      });
  }

  onFilter(category: string) {
    this.router.navigate(["/articles/category", category]);
  }

  onAuthorClick(authorId: string) {
    this.router.navigate(["/users", authorId]);
  }

  toggleMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }
}
