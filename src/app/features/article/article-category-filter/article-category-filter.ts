import { Component } from "@angular/core";
import { articleCategories } from "../../../config";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-article-category-filter",
  imports: [RouterLink],
  templateUrl: "./article-category-filter.html",
  styleUrl: "./article-category-filter.css",
})
export class ArticleCategoryFilterComponent {
  isMenuOpened: boolean = false;
  categories: string[] = articleCategories;
  visibleCategories = this.categories.slice(0, 10);
  hiddenCategories = this.categories.slice(10);
}
