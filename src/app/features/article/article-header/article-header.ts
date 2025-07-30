import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Article } from "../../../types";
import { AsyncPipe, DatePipe } from "@angular/common";
import { Observable } from "rxjs";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-article-header",
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: "./article-header.html",
  styleUrl: "./article-header.css",
})
export class ArticleHeaderComponent {
  @Input() likes$!: Observable<number>;
  @Input() article!: Article;

  @Input() isCopied!: boolean;
  @Input() hasLiked!: boolean;
  @Input() hasBookmarked!: boolean;
  @Input() currentUserId!: string | undefined;
  @Input() articleId!: string;

  @Output() authorClick = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();
  @Output() like = new EventEmitter<void>();
  @Output() bookmark = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();

  onAuthorClick(authorId: string | undefined) {
    this.authorClick.emit(authorId);
  }

  onLike(): void {
    this.like.emit();
  }

  onBookmark() {
    this.bookmark.emit();
  }

  onShare() {
    this.share.emit();
  }

  onDelete() {
    this.delete.emit();
  }
}
