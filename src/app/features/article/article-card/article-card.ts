import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Article } from "../../../types";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-article-card",
  imports: [RouterLink, DatePipe],
  templateUrl: "./article-card.html",
  styleUrl: "./article-card.css",
})
export class ArticleCardComponent {
  @Input() article!: Article;
  @Output() openAuthorDetail = new EventEmitter<string>();

  onAuthorClick(authorId: string) {
    this.openAuthorDetail.emit(authorId);
  }
}
