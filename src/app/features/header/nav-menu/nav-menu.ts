import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MenuDropdownComponent } from "../menu-dropdown/menu-dropdown";
import { CtaButtonComponent } from "../../../shared/buttons/cta-button/cta-button";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { RouterLink } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "firebase/auth";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-nav-menu",
  imports: [AsyncPipe, RouterLink, MenuDropdownComponent, CtaButtonComponent],
  templateUrl: "./nav-menu.html",
  styleUrl: "./nav-menu.css",
  animations: [
    trigger("menuIconToggle", [
      state("opened", style({ transform: "rotate(180deg)" })),
      state("closed", style({ transform: "rotate(0deg)" })),
      transition("opened <=> closed", [animate("400ms ease-in-out")]),
    ]),
  ],
})
export class NavMenuComponent {
  @Input() currentUser$!: Observable<User | null>;
  @Input() isMenuOpened!: boolean;

  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();
  @Output() myArticlesClick = new EventEmitter<void>();

  onLogin(): void {
    this.loginClick.emit();
  }

  onRegister(): void {
    this.registerClick.emit();
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }
}
