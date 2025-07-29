import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-menu-dropdown",
  imports: [RouterLink],
  templateUrl: "./menu-dropdown.html",
  styleUrl: "./menu-dropdown.css",
})
export class MenuDropdownComponent {
  //! Make the dropdown menu close on every click on an item from within it

  @Output() logoutClick = new EventEmitter<void>();
  @Output() myArticlesClick = new EventEmitter<void>();

  onLogout(): void {
    this.logoutClick.emit();
  }

  loadMyArticles() {
    this.myArticlesClick.emit();
  }
}
