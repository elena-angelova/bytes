import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Article } from "../../../types";
import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { Observable } from "rxjs";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-article-header",
  imports: [NgIf, AsyncPipe, DatePipe, RouterLink],
  templateUrl: "./article-header.html",
  styleUrl: "./article-header.css",
})
export class ArticleHeaderComponent {
  @Input() article$!: Observable<Article | undefined>;
  @Input() hasLiked!: boolean;
  @Input() currentUserId!: string | undefined;
  @Input() articleId!: string;

  @Output() openAuthorDetails = new EventEmitter<string>();
  @Output() likeClick = new EventEmitter<{
    likedBy: string[] | undefined;
    heartIcon: HTMLElement;
  }>();
  @Output() delete = new EventEmitter<void>();

  onAuthorClick(authorId: string | undefined) {
    this.openAuthorDetails.emit(authorId);
  }

  onLikeClick(likedBy: string[] | undefined, heartIcon: HTMLElement): void {
    this.likeClick.emit({ likedBy, heartIcon });
  }

  onDelete() {
    this.delete.emit();
  }
}
