import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Article } from "../../../types";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-article-header",
  imports: [DatePipe],
  templateUrl: "./article-header.html",
  styleUrl: "./article-header.css",
})
export class ArticleHeaderComponent {
  @Input() article!: Article | undefined;
  @Input() isLoggedIn!: boolean;

  @Output() openAuthorDetails = new EventEmitter<string>();

  onAuthorClick(authorId: string | undefined) {
    this.openAuthorDetails.emit(authorId);
  }
}
