import { Component, OnDestroy, OnInit } from "@angular/core";
import { Article } from "../../types";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute } from "@angular/router";
import { finalize, map, Subscription, switchMap, tap } from "rxjs";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { LoaderComponent } from "../../shared/loader/loader";
import { AuthService } from "../../services/auth.service";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { firebaseErrorMessages } from "../../config";
import { ErrorService } from "../../services/error.service";
import { FirebaseError } from "firebase/app";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";

@Component({
  selector: "app-category",
  imports: [
    SectionTitleComponent,
    ArticleGridComponent,
    CtaButtonComponent,
    EmptyStateComponent,
    LoaderComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./category.html",
  styleUrl: "./category.css",
})
export class CategoryComponent implements OnInit, OnDestroy {
  category: string = "";
  articles: Article[] = [];

  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  isLoadingMore: boolean = false;
  hasMore: boolean = true;

  hasError: boolean = false;
  serverErrorMessage: string = "";
  private readonly pageSize = 9;

  private currentUserSub?: Subscription;
  private routeSub?: Subscription;
  private loadMoreSub?: Subscription;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private errorService: ErrorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.currentUser$.subscribe(
      (currentUser) => (this.isLoggedIn = !!currentUser)
    );

    this.routeSub = this.route.paramMap
      .pipe(
        map((params) => params.get("category")!),
        tap((category) => (this.category = category)),
        switchMap((category) => {
          this.isLoading = true;
          this.articleService.resetPagination();
          this.articles = [];

          return this.articleService
            .getArticlesByCategory(category, this.pageSize)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            );
        })
      )
      .subscribe({
        next: (articles) => this.addArticles(articles),
        error: (error: FirebaseError) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );
        },
      });
  }

  loadMore() {
    if (!this.hasMore || this.isLoadingMore) return;

    this.isLoadingMore = true;

    this.loadMoreSub = this.articleService
      .getArticlesByCategory(this.category, this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoadingMore = false;
        })
      )
      .subscribe({
        next: (articles) => this.addArticles(articles),
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );
        },
      });
  }

  addArticles(articles: Article[]): void {
    this.hasMore = articles.length === this.pageSize;

    if (articles.length === 0) return;

    this.articles = [...this.articles, ...articles];
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
    this.routeSub?.unsubscribe();
    this.loadMoreSub?.unsubscribe();
  }
}
