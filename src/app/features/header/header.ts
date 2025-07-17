import { Component, OnInit } from "@angular/core";
import { CtaButtonComponent } from "../../ui/buttons/cta-button/cta-button";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { SearchBarComponent } from "./search-bar/search-bar";
import { MenuDropdownComponent } from "./menu-dropdown/menu-dropdown";
import { RouterLink } from "@angular/router";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  imports: [
    RouterLink,
    CtaButtonComponent,
    SearchBarComponent,
    MenuDropdownComponent,
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
  animations: [
    trigger("iconSwap", [
      state("light", style({ transform: "rotate({{rotate}})" }), {
        params: { rotate: "0deg" },
      }),
      state("dark", style({ transform: "rotate({{rotate}})" }), {
        params: { rotate: "180deg" },
      }),
      transition("light <=> dark", [animate("400ms ease-in-out")]),
    ]),
    trigger("menuIconToggle", [
      state("opened", style({ transform: "rotate(180deg)" })),
      state("closed", style({ transform: "rotate(0deg)" })),
      transition("opened <=> closed", [animate("400ms ease-in-out")]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  // !Move the light/dark mode switch in a separate component
  // !Move the dropdown menu in a separate component
  isDarkMode: boolean = false;
  theme: "light" | "dark" = "light";
  rotation: number = 0;
  isMenuOpened: boolean = false;
  isLoggedIn: boolean = false; // !Remove this when you integrate the auth service

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {
    const savedMode: string | null = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark-mode");
    }

    this.authService.isLoggedIn().subscribe((user) => {
      this.isLoggedIn = user ? true : false;
    });
  }

  ngOnInit(): void {
    const savedMode: string | null = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.theme = "light";
      this.rotation += 180;
    }
  }

  toggleTheme(): void {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.rotation += 180;
    this.isDarkMode = !this.isDarkMode;

    document.body.classList.toggle("dark-mode", this.isDarkMode);
    localStorage.setItem("darkMode", this.isDarkMode.toString());
  }

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  getToggleIconState(): "opened" | "closed" {
    return this.isMenuOpened ? "opened" : "closed";
  }

  onLoginClick(): void {
    this.modalService.openLoginModal();
  }

  onRegisterClick(): void {
    this.modalService.openRegisterModal();
  }
}
