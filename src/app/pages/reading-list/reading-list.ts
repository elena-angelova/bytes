import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { EMPTY, finalize, of, Subscription, switchMap, take } from "rxjs";
import { ArticleService } from "../../services/article.service";
import { Article } from "../../types";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleListComponent } from "../../features/article/article-list/article-list";
import { LoaderComponent } from "../../shared/loader/loader";
import { ErrorService } from "../../services/error.service";
import { customErrorMessages, firebaseErrorMessages } from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";

@Component({
  selector: "app-reading-list",
  imports: [
    LoaderComponent,
    SectionTitleComponent,
    ArticleListComponent,
    CtaButtonComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./reading-list.html",
  styleUrl: "./reading-list.css",
})
export class ReadingListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  articleIds: string[] = [];
  private currentPage: number = 1;
  private readonly pageSize = 9;

  hasMore: boolean = true;
  isLoading: boolean = true;
  isLoadingMore: boolean = false;

  hasError: boolean = false;
  serverErrorMessage: string = "";

  private currentUserSub?: Subscription;
  private loadMoreSub?: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private articleService: ArticleService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.currentUser$
      .pipe(
        switchMap((currentUser) => {
          // Check if a user is currently logged in
          if (!currentUser) {
            const errorCode = "unauthenticated";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoading = false;
            return EMPTY;
          }

          // Fetch current user's profile data
          return this.userService.getUserData(currentUser.uid).pipe(take(1));
        }),
        switchMap((userData) => {
          // If profile can't be found, show an error message
          if (!userData) {
            const errorCode = "current-user/not-found";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoading = false;
            return EMPTY;
          }

          // If the reading list is empty, return an empty array
          if (userData.readingList.length === 0) {
            this.hasMore = false;
            this.isLoading = false;
            return of([]);
          }

          // Reverse reading list so recently saved articles are first
          this.articleIds = userData.readingList.reverse();

          // Take the first batch of articles
          const firstPageIds = this.articleIds.slice(0, this.pageSize);

          // Determine if there are more articles to load based on whether the current batch is full
          this.hasMore = firstPageIds.length === this.pageSize;

          // Fetch the first batch of articles
          return this.articleService.getReadingListArticles(firstPageIds).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          );
        })
      )
      .subscribe({
        next: (articles) => {
          this.articles = articles;
        },
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );

          this.isLoading = false;
        },
      });
  }

  // Fetch subsequent batches
  loadMore() {
    // Prevent loading more if already loading or no more articles to load
    if (!this.hasMore || this.isLoadingMore) return;

    // Get the next batch of article IDs
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextPageIds = this.articleIds.slice(start, end);

    // Stop loading if there are no more article IDs to fetch
    if (nextPageIds.length === 0) return;

    this.isLoadingMore = true;

    // Determine if there are more articles to load based on whether the current batch is full
    this.hasMore = nextPageIds.length === this.pageSize;

    this.loadMoreSub = this.articleService
      .getReadingListArticles(nextPageIds)
      .pipe(
        finalize(() => {
          this.isLoadingMore = false;
        })
      )
      .subscribe({
        next: (newArticles) => {
          // Append new articles to the list and move to the next page
          this.articles = [...this.articles, ...newArticles];
          this.currentPage++;
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

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
    this.loadMoreSub?.unsubscribe();
  }
}
