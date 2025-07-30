import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-menu-dropdown",
  imports: [],
  templateUrl: "./menu-dropdown.html",
  styleUrl: "./menu-dropdown.css",
})
export class MenuDropdownComponent {
  @Output() profileClick = new EventEmitter<void>();
  @Output() readingListClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
