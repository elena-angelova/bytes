import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { SearchBarComponent } from "./search-bar/search-bar";
import { NavMenuComponent } from "./nav-menu/nav-menu";
import { ThemeToggleButtonComponent } from "./theme-toggle-button/theme-toggle-button";
import { Observable, Subscription } from "rxjs";
import { User } from "firebase/auth";
import { ErrorService } from "../../services/error.service";
import { customErrorMessages, firebaseErrorMessages } from "../../config";

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
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser$!: Observable<User | null>;

  theme: "light" | "dark" = "light";
  isDarkMode: boolean = false;
  rotation: number = 0;

  isMenuOpened: boolean = false;
  hasError: boolean = false;
  serverErrorMessage: string = "";

  private currentUserSub?: Subscription;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {
    // Apply dark mode if saved in local storage
    const savedMode: string | null = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark-mode");
    }

    this.currentUser$ = authService.currentUser$;
  }

  ngOnInit(): void {
    // Set the theme toggle icon based on saved mode
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

  onLogin(): void {
    this.modalService.openLoginModal();
  }

  onRegister(): void {
    this.modalService.openRegisterModal();
  }

  async onLogout() {
    this.toggleMenu();

    try {
      await this.authService.logout();
      this.router.navigate(["/"]);
    } catch (error: any) {
      this.errorService.handleError(this, error.code, firebaseErrorMessages);
    }
  }

  openProfile() {
    this.toggleMenu();

    this.currentUserSub = this.currentUser$.subscribe((user) => {
      if (!user) {
        const errorCode = "unauthenticated";
        this.errorService.handleError(this, errorCode, customErrorMessages);
        return;
      }

      this.router.navigate(["/users", user.uid]);
    });
  }

  openReadingList() {
    this.toggleMenu();
    this.router.navigate(["/reading-list"]);
  }

  openSettings() {
    this.toggleMenu();
    this.router.navigate(["/settings"]);
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }
}
