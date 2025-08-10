import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { Article } from "../../types";
import { ErrorService } from "../../services/error.service";
import { firebaseErrorMessages } from "../../config";
import { finalize } from "rxjs";
import { LoaderComponent } from "../../shared/loader/loader";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ArticleGridComponent } from "../../features/article/article-grid/article-grid";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";

@Component({
  selector: "app-search-results",
  imports: [
    LoaderComponent,
    SectionTitleComponent,
    ArticleGridComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./search-results.html",
  styleUrl: "./search-results.css",
})
export class SearchResultsComponent implements OnInit {
  query: string = "";
  results: Article[] = [];

  isLoading: boolean = true;
  hasError: boolean = false;
  serverErrorMessage: string = "";

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    // Get the search query and fetch results
    this.route.queryParamMap.subscribe((params) => {
      this.query = params.get("q") || "";
      this.fetchResults(this.query);
    });
  }

  fetchResults(query: string) {
    // Call the article service to search articles based on the query
    this.articleService
      .searchArticles(query)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (results) => {
          this.results = results;
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
}
