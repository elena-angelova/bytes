import { Component, OnInit } from "@angular/core";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { ArticleService } from "../../services/article.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
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
    RouterLink,
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

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  //! Implement infinite scroll
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.authorId = params.get("userId")!;
      this.currentUserId = this.authService.getCurrentUser()?.uid;

      this.userService
        .getUserData(this.authorId)
        .pipe(tap(() => (this.isLoading = false)))
        .subscribe({
          next: (data) => {
            this.authorDetails = data;
            this.authorName = `${data?.firstName} ${data?.lastName}`;
          },
          error: (err) => console.log(err), //! Add error handling
        });

      this.articleService
        .getArticlesByAuthor(this.authorId)
        .pipe(tap(() => (this.isLoading = false)))
        .subscribe({
          next: (articles) => (this.articles = articles),
          error: (err) => console.log(err), //! Add error handling
        });
    });
  }
}
