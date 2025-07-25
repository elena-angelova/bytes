import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { SearchBarComponent } from "./search-bar/search-bar";
import { NavMenuComponent } from "./nav-menu/nav-menu";
import { ThemeToggleButtonComponent } from "./theme-toggle-button/theme-toggle-button";
import { Observable } from "rxjs";
import { User } from "firebase/auth";

@Component({
  selector: "app-header",
  imports: [
    RouterLink,
    SearchBarComponent,
    NavMenuComponent,
    ThemeToggleButtonComponent,
  ],
  templateUrl: "./header.html",
  styleUrl: "./header.css",
})
export class HeaderComponent implements OnInit {
  currentUser$!: Observable<User | null>;

  theme: "light" | "dark" = "light";
  isDarkMode: boolean = false;
  rotation: number = 0;

  isMenuOpened: boolean = false;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router
  ) {
    const savedMode: string | null = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark-mode");
    }

    this.currentUser$ = authService.currentUser$;
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

  onLoginClick(): void {
    this.modalService.openLoginModal();
  }

  onRegisterClick(): void {
    this.modalService.openRegisterModal();
  }

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  async onLogoutClick() {
    this.toggleMenu();

    try {
      await this.authService.logout();
      await this.router.navigate([""]);
    } catch (error) {
      // !See how you'll visualise the error if logout fails
    }
  }

  onMyArticlesClick() {
    this.toggleMenu();

    this.currentUser$.subscribe((user) => {
      const userId: string | undefined = user?.uid;
      this.router.navigate(["/users", userId]);
    });
  }
}
