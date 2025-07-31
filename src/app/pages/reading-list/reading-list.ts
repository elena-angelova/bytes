import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { filter, of, Subscription, switchMap, tap } from "rxjs";
import { User } from "firebase/auth";
import { ArticleService } from "../../services/article.service";
import { Article } from "../../types";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { LoaderComponent } from "../../shared/loader/loader";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { Router } from "@angular/router";

@Component({
  selector: "app-reading-list",
  imports: [
    LoaderComponent,
    SectionTitleComponent,
    ArticleGridComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./reading-list.html",
  styleUrl: "./reading-list.css",
})
export class ReadingListComponent implements OnInit {
  articles!: Article[];
  currentUserId!: string;
  isEmpty!: boolean;
  isLoading: boolean = true;

  readingListSub?: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.readingListSub = this.authService.currentUser$
      .pipe(
        filter((currentUser): currentUser is User => !!currentUser),
        tap((currentUser) => (this.currentUserId = currentUser.uid)),
        switchMap((currentUser) =>
          this.userService.getUserData(currentUser.uid).pipe(
            switchMap((userData) => {
              if (!userData) {
                //! Add error handling
                return of([]);
              }
              const articleIds = userData.readingList;

              if (articleIds.length === 0) {
                this.isLoading = false;
                this.isEmpty = true;

                return of([]);
              }

              this.isLoading = false;
              return this.articleService.getReadingListArticles(articleIds);
            })
          )
        )
      )
      .subscribe({
        next: (articles) => {
          this.articles = articles;
        },
        error: (err) => console.log(err), //! Add error handling
      });
  }

  openAuthorProfile(authorId: string) {
    this.router.navigate(["/users", authorId]);
  }

  ngOnDestroy() {
    this.readingListSub?.unsubscribe();
  }
}
