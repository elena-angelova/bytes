import { Component, OnInit } from "@angular/core";
import { SectionTitleComponent } from "../../ui/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { ArticlesService } from "../../services/articles.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { tap } from "rxjs";
import { Article, User } from "../../types";
import { DatePipe } from "@angular/common";
import { LoaderComponent } from "../../ui/loader/loader";
import { EmptyStateComponent } from "../../ui/empty-state/empty-state";

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
    private articleService: ArticlesService,
    private userService: UsersService
  ) {}

  //! Implement infinite scroll
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.authorId = params.get("userId")!;

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
