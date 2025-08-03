import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Article } from "../../../types";
import { AsyncPipe, DatePipe } from "@angular/common";
import { Observable } from "rxjs";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-article-header",
  imports: [DatePipe, RouterLink],
  templateUrl: "./article-header.html",
  styleUrl: "./article-header.css",
})
export class ArticleHeaderComponent {
  @Input() currentUserId!: string | undefined;
  @Input() articleId!: string;
  @Input() article!: Article;

  @Input() isCopied!: boolean;
  @Input() isOwner!: boolean;
  @Input() hasLiked!: boolean;
  @Input() hasBookmarked!: boolean;

  @Output() authorClick = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();
  @Output() like = new EventEmitter<void>();
  @Output() bookmark = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();

  onLike() {
    if (this.isOwner) return;
    this.like.emit();
  }
}
