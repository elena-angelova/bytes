import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ArticleCardComponent } from "../article-card/article-card";
import { Article } from "../../../types";

@Component({
  selector: "app-article-grid",
  imports: [ArticleCardComponent],
  templateUrl: "./article-grid.html",
  styleUrl: "./article-grid.css",
})
export class ArticleGridComponent {
  @Input() articles!: Article[];
  @Input() columns!: number;

  @Output() openAuthorDetail = new EventEmitter<string>();

  onAuthorClick(authorId: string) {
    this.openAuthorDetail.emit(authorId);
  }
}
