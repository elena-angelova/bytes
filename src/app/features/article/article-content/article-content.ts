import { Component, Input, OnInit } from "@angular/core";
import { Article } from "../../../types";
import { SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-article-content",
  imports: [],
  templateUrl: "./article-content.html",
  styleUrl: "./article-content.css",
})
export class ArticleContentComponent {
  @Input() sanitizedContent!: SafeHtml | null;
}
