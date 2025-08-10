import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-search-bar",
  imports: [FormsModule],
  templateUrl: "./search-bar.html",
  styleUrl: "./search-bar.css",
})
export class SearchBarComponent {
  query: string = "";

  constructor(private router: Router) {}

  onSearch() {
    if (this.query.trim()) {
      this.router.navigate(["/search"], {
        queryParams: { q: this.query.trim() },
      });

      this.query = "";
    }
  }
}
