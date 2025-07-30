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

  @Output() login = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() toggleMenu = new EventEmitter<void>();

  @Output() profileClick = new EventEmitter<void>();
  @Output() readingListClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
