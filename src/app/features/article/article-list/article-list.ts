import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Article } from "../../../types";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-article-list",
  imports: [DatePipe, RouterLink],
  templateUrl: "./article-list.html",
  styleUrl: "./article-list.css",
})
export class ArticleListComponent {
  @Input() articles: Article[] = [];

  @Output() authorClick = new EventEmitter<string>();
}
