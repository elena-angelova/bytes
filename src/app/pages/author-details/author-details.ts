import { Component, OnInit } from "@angular/core";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user.service";
import { tap } from "rxjs";
import { Article, User } from "../../types";
import { DatePipe } from "@angular/common";
import { LoaderComponent } from "../../shared/loader/loader";
import { EmptyStateComponent } from "../../shared/empty-state/empty-state";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-author-details",
  imports: [
    DatePipe,
    SectionTitleComponent,
    ArticleGridComponent,
    LoaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./author-details.html",
  styleUrl: "./author-details.css",
})
export class AuthorDetailsComponent implements OnInit {
  authorId!: string;
  authorName!: string;
  authorDetails!: User | undefined;
  articles: Article[] = [];
  isLoading: boolean = true;
  currentUserId!: string | undefined;
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  //! Implement infinite scroll
  ngOnInit(): void {
    //! Merge these into one pipe and unsubscribe
    this.route.paramMap.subscribe((params) => {
      this.authorId = params.get("userId")!;
      this.currentUserId = this.authService.getCurrentUser()?.uid;

      if (this.currentUserId === this.authorId) {
        this.isOwner = true;
      }

      this.userService
        .getUserData(this.authorId)
        .pipe(tap(() => (this.isLoading = false)))
        .subscribe({
          next: (data) => {
            this.authorDetails = data; //! Add error handling (NotFoundComponent) if the server returns no user
            this.authorName = `${data?.firstName} ${data?.lastName}`;
          },
          error: (err) => console.log(err), //! Add error handling
        });

      this.articleService
        .getArticlesByAuthor(this.authorId)
        .pipe(tap(() => (this.isLoading = false)))
        .subscribe({
          next: (articles) => (this.articles = articles), //! Add error handling (EmptyStateComponent) if the server returns no articles
          error: (err) => console.log(err), //! Add error handling
        });
    });
  }
}
