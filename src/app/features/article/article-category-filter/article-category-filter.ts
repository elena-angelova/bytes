import { Component, EventEmitter, Input, Output } from "@angular/core";
import { articleCategories } from "../../../config";

@Component({
  selector: "app-article-category-filter",
  imports: [],
  templateUrl: "./article-category-filter.html",
  styleUrl: "./article-category-filter.css",
})
export class ArticleCategoryFilterComponent {
  @Input() isMenuOpened!: boolean;

  @Output() filter = new EventEmitter<string>();
  @Output() toggleMenu = new EventEmitter<void>();

  categories: string[] = articleCategories;
  visibleCategories = this.categories.slice(0, 10);
  hiddenCategories = this.categories.slice(10);
}
