import { Component, OnDestroy, OnInit } from "@angular/core";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";
import { LoaderComponent } from "../../shared/loader/loader";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import {
  combineLatest,
  finalize,
  forkJoin,
  map,
  Subscription,
  switchMap,
  take,
} from "rxjs";
import { Article, User } from "../../types";
import { DatePipe } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { ErrorService } from "../../services/error.service";
import { firebaseErrorMessages } from "../../config";

@Component({
  selector: "app-author-details",
  imports: [
    DatePipe,
    SectionTitleComponent,
    ArticleGridComponent,
    CtaButtonComponent,
    LoaderComponent,
    EmptyStateComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./author-details.html",
  styleUrl: "./author-details.css",
})
export class AuthorDetailsComponent implements OnInit, OnDestroy {
  authorName: string = "";
  authorDetails: User | undefined;
  articles: Article[] = [];
  userId: string = "";

  isLoading: boolean = true;
  isLoadingMore: boolean = false;
  hasMore: boolean = true;

  isLoggedIn!: boolean;
  isOwner: boolean = false;

  hasError: boolean = false;
  serverErrorMessage: string = "";
  private readonly pageSize = 8;

  private routeSub?: Subscription;
  private loadMoreSub?: Subscription;

  constructor(
    private articleService: ArticleService,
    private userService: UserService,
    private authService: AuthService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user UID and author ID
    this.routeSub = combineLatest([
      this.authService.currentUser$.pipe(map((user) => user?.uid)),
      this.route.paramMap.pipe(map((params) => params.get("userId")!)),
    ])
      .pipe(
        switchMap(([currentUserId, userId]) => {
          this.userId = userId;

          // Reset pagination and clear articles to load fresh data when route parameter changes
          this.isLoading = true;
          this.articleService.resetPagination();
          this.articles = [];

          if (currentUserId) {
            this.isLoggedIn = true;
          }

          if (currentUserId === userId) {
            this.isOwner = true;
          }

          // Fetch author's profile data and the first batch of articles they have written
          return forkJoin({
            userData: this.userService.getUserData(userId).pipe(take(1)),
            articles: this.articleService.getArticlesByAuthor(
              userId,
              this.pageSize
            ),
          }).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          );
        })
      )
      .subscribe({
        next: ({ userData, articles }) => {
          // If profile doesn't exist, redirect to the Not Found page
          if (!userData) {
            this.router.navigate(["/not-found"]);
            return;
          }

          this.authorDetails = userData;
          this.authorName = `${userData?.firstName} ${userData?.lastName}`;

          this.addArticles(articles);
        },
        error: (error) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );
        },
      });
  }

  // Fetch subsequent batches
  loadMore() {
    // Prevent loading more if already loading or no more articles to load
    if (!this.hasMore || this.isLoadingMore) return;

    this.isLoadingMore = true;

    this.loadMoreSub = this.articleService
      .getArticlesByAuthor(this.userId, this.pageSize)
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

  // Append articles to the list
  addArticles(articles: Article[]): void {
    // Determine if there are more articles to load based on whether the current batch is full
    this.hasMore = articles.length === this.pageSize;

    if (articles.length === 0) return;

    this.articles = [...this.articles, ...articles];
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.loadMoreSub?.unsubscribe();
  }
}
