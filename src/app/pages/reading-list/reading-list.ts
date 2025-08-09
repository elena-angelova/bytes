import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { EMPTY, finalize, of, Subscription, switchMap, take } from "rxjs";
import { ArticleService } from "../../services/article.service";
import { Article } from "../../types";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleListComponent } from "../../features/article/article-list/article-list";
import { LoaderComponent } from "../../shared/loader/loader";
import { Router } from "@angular/router";
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
    private errorService: ErrorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.currentUser$
      .pipe(
        switchMap((currentUser) => {
          if (!currentUser) {
            const errorCode = "unauthenticated";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoading = false;
            return EMPTY;
          }

          return this.userService.getUserData(currentUser.uid).pipe(take(1));
        }),
        switchMap((userData) => {
          if (!userData) {
            const errorCode = "current-user/not-found";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoading = false;
            return EMPTY;
          }

          if (userData.readingList.length === 0) {
            this.hasMore = false;
            return of([]);
          }

          this.articleIds = userData.readingList.reverse();
          const firstPageIds = this.articleIds.slice(0, this.pageSize);
          this.hasMore = firstPageIds.length === this.pageSize;

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

  loadMore() {
    if (!this.hasMore || this.isLoadingMore) return;

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextPageIds = this.articleIds.slice(start, end);

    if (nextPageIds.length === 0) return;

    this.isLoadingMore = true;
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

  openAuthorProfile(authorId: string) {
    this.router.navigate(["/users", authorId]);
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
    this.loadMoreSub?.unsubscribe();
  }
}

// export class ReadingListComponent implements OnInit {
//   articles: Article[] = [];
//   articleIds: string[] = [];
//   currentPage: number = 1;
//   private readonly pageSize = 9;

//   isLoading: boolean = true;
//   isLoadingMore: boolean = false;
//   hasError: boolean = false;
//   serverErrorMessage: string = "";
//   observer!: IntersectionObserver;

//   @ViewChild("scrollAnchor") scrollAnchor!: ElementRef;

//   constructor(
//     private authService: AuthService,
//     private userService: UserService,
//     private articleService: ArticleService,
//     private errorService: ErrorService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.authService.currentUser$
//       .pipe(
//         switchMap((currentUser) => {
//           if (!currentUser) {
//             const errorCode = "unauthenticated";
//             this.errorService.handleError(this, errorCode, customErrorMessages);
//             this.isLoading = false;
//             return EMPTY;
//           }

//           return this.userService.getUserData(currentUser.uid);
//         }),
//         switchMap((userData) => {
//           if (!userData) {
//             const errorCode = "current-user/not-found";
//             this.errorService.handleError(this, errorCode, customErrorMessages);
//             this.isLoading = false;
//             return EMPTY;
//           }

//           if (userData.readingList.length === 0) return of([]);

//           this.articleIds = userData.readingList.reverse();
//           const pageIds = this.articleIds.slice(0, this.pageSize);

//           return this.articleService.getReadingListArticles(pageIds);
//         }),
//         take(1)
//       )
//       .subscribe({
//         next: (articles) => {
//           this.articles = articles;
//           this.isLoading = false;

//           setTimeout(() => {
//             this.observer.observe(this.scrollAnchor.nativeElement);
//           });
//         },
//         error: (error: any) => {
//           this.errorService.handleError(
//             this,
//             error.code,
//             firebaseErrorMessages
//           );

//           this.isLoading = false;
//         },
//       });
//   }

//   ngAfterViewInit() {
//     this.observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !this.isLoadingMore) {
//         this.loadMore();
//       }
//     });
//   }

//   loadMore() {
//     if (this.isLoadingMore) return;

//     const start = this.currentPage * this.pageSize;
//     const end = start + this.pageSize;
//     const nextPageIds = this.articleIds.slice(start, end);

//     if (nextPageIds.length === 0) return;

//     this.isLoadingMore = true;

//     this.articleService
//       .getReadingListArticles(nextPageIds)
//       .pipe(take(1))
//       .subscribe({
//         next: (newArticles) => {
//           this.articles = [...this.articles, ...newArticles];
//           this.isLoadingMore = false;
//           this.currentPage++;
//         },
//         error: (error: any) => {
//           this.errorService.handleError(
//             this,
//             error.code,
//             firebaseErrorMessages
//           );
//           this.isLoadingMore = false;
//         },
//       });
//   }

//   openAuthorProfile(authorId: string) {
//     this.router.navigate(["/users", authorId]);
//   }
// }
