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
  @Input() currentUserId: string | undefined;
  @Input() articleId: string = "";
  @Input() article!: Article;

  @Input() isCopied: boolean = false;
  @Input() isOwner: boolean = false;
  @Input() hasLiked: boolean = false;
  @Input() hasBookmarked: boolean = false;

  @Output() delete = new EventEmitter<void>();
  @Output() like = new EventEmitter<void>();
  @Output() bookmark = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();

  isMenuOpened: boolean = false;

  onLike() {
    if (this.isOwner) return;
    this.like.emit();
  }
}
