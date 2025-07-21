import { Component, OnInit } from "@angular/core";
import { SectionTitleComponent } from "../../ui/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { ArticlesService } from "../../services/articles.service";
import { ActivatedRoute } from "@angular/router";
import { UsersService } from "../../services/users.service";
import { tap } from "rxjs";
import { Article, User } from "../../types";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-author-details",
  imports: [DatePipe, SectionTitleComponent, ArticleGridComponent],
  templateUrl: "./author-details.html",
  styleUrl: "./author-details.css",
})
export class AuthorDetailsComponent implements OnInit {
  authorId!: string;
  authorName!: string;
  authorDetails!: User | undefined;
  isLoading: boolean = true;
  articles: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticlesService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.authorId = this.route.snapshot.paramMap.get("userId")!;

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
  }
}
