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

@Component({
  selector: "app-header",
  imports: [CtaButtonComponent, SearchBarComponent],
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
  ],
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean = false;
  theme: "light" | "dark" = "light";
  rotation: number = 0;

  constructor() {
    const savedMode: string | null = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      this.isDarkMode = true;
      document.body.classList.add("dark-mode");
    }
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
}
