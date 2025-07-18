import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-menu-dropdown",
  imports: [],
  templateUrl: "./menu-dropdown.html",
  styleUrl: "./menu-dropdown.css",
})
export class MenuDropdownComponent {
  @Output() logoutClick = new EventEmitter<void>();
  @Output() closeMenu = new EventEmitter<void>();

  onLogout(): void {
    this.closeMenu.emit();
    this.logoutClick.emit();
  }
}

// !Dropdown menu should close after login
