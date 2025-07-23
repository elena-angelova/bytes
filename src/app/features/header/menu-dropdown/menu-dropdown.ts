import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-menu-dropdown",
  imports: [],
  templateUrl: "./menu-dropdown.html",
  styleUrl: "./menu-dropdown.css",
})
export class MenuDropdownComponent {
  @Output() logoutClick = new EventEmitter<void>();
  @Output() myArticlesClick = new EventEmitter<void>();

  onLogout(): void {
    this.logoutClick.emit();
  }

  loadMyArticles() {
    this.myArticlesClick.emit();
  }
}
