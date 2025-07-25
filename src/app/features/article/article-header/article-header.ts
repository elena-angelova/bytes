import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Article } from "../../../types";
import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { Observable } from "rxjs";

@Component({
  selector: "app-article-header",
  imports: [NgIf, AsyncPipe, DatePipe],
  templateUrl: "./article-header.html",
  styleUrl: "./article-header.css",
})
export class ArticleHeaderComponent {
  @Input() article$!: Observable<Article | undefined>;
  @Input() hasLiked!: boolean;

  @Output() openAuthorDetails = new EventEmitter<string>();
  @Output() likeClick = new EventEmitter<{
    likedBy: string[] | undefined;
    heartIcon: HTMLElement;
  }>();

  onAuthorClick(authorId: string | undefined) {
    this.openAuthorDetails.emit(authorId);
  }

  onLikeClick(likedBy: string[] | undefined, heartIcon: HTMLElement): void {
    this.likeClick.emit({ likedBy, heartIcon });
  }
}
