import { Component, OnDestroy, OnInit } from "@angular/core";
import { Article } from "../../types";
import { ArticleService } from "../../services/article.service";
import { ArticleCategoryFilterComponent } from "../../features/article/article-category-filter/article-category-filter";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { LoaderComponent } from "../../shared/loader/loader";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { ErrorService } from "../../services/error.service";
import { firebaseErrorMessages } from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";
import { finalize, Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-articles",
  imports: [
    ArticleCategoryFilterComponent,
    ArticleGridComponent,
    CtaButtonComponent,
    LoaderComponent,
    EmptyStateComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./articles.html",
  styleUrl: "./articles.css",
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles: Article[] = [];

  isLoggedIn: boolean = false;
  isMenuOpened: boolean = false;
  isLoading: boolean = true;
  isLoadingMore: boolean = false;
  hasMore: boolean = true;

  hasError: boolean = false;
  serverErrorMessage: string = "";
  private readonly pageSize = 9;

  private currentUserSub?: Subscription;
  private articlesSub?: Subscription;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    // Check if a user is currently logged in (for EmptyStateComponent)
    this.currentUserSub = this.authService.currentUser$.subscribe(
      (currentUser) => (this.isLoggedIn = !!currentUser)
    );

    // Reset the last doc saved in the article service
    this.articleService.resetPagination();
    this.loadArticles();
  }

  loadMore() {
    // Prevent loading more if already loading or no more articles to load
    if (!this.hasMore || this.isLoadingMore) return;

    this.isLoadingMore = true;
    this.loadArticles();
  }

  // Fetch a batch of articles
  loadArticles(): void {
    this.articlesSub = this.articleService
      .getArticles(this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.isLoadingMore = false;
        })
      )
      .subscribe({
        next: (articles) => {
          // Determine if there are more articles to load based on whether the current batch is full
          this.hasMore = articles.length === this.pageSize;

          if (articles.length === 0) return;

          // Append new articles to the existing list
          this.articles = [...this.articles, ...articles];
        },
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.currentUserSub?.unsubscribe();
    this.articlesSub?.unsubscribe();
  }
}
