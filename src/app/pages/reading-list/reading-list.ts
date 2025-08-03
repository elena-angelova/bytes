import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { EMPTY, of, Subscription, switchMap } from "rxjs";
import { ArticleService } from "../../services/article.service";
import { Article } from "../../types";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { LoaderComponent } from "../../shared/loader/loader";
import { Router } from "@angular/router";
import { ErrorService } from "../../services/error.service";
import { customErrorMessages, firebaseErrorMessages } from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";

@Component({
  selector: "app-reading-list",
  imports: [
    LoaderComponent,
    SectionTitleComponent,
    ArticleGridComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./reading-list.html",
  styleUrl: "./reading-list.css",
})
export class ReadingListComponent implements OnInit {
  articles!: Article[];

  isLoading: boolean = true;
  hasError: boolean = false;
  serverErrorMessage: string = "";

  currentUserSub?: Subscription;

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

          return this.userService.getUserData(currentUser.uid);
        }),
        switchMap((userData) => {
          if (!userData) {
            const errorCode = "current-user/not-found";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoading = false;
            return EMPTY;
          }

          const articleIds = userData.readingList;

          if (articleIds.length === 0) return of([]);

          return this.articleService.getReadingListArticles(articleIds);
        })
      )
      .subscribe({
        next: (articles) => {
          this.articles = articles;
          this.isLoading = false;
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

  openAuthorProfile(authorId: string) {
    this.router.navigate(["/users", authorId]);
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }
}
