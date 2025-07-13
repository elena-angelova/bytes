import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./features/header/header";
import { FooterComponent } from "./features/footer/footer";
import { SectionTitleComponent } from "./ui/section-title/section-title";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}

// !Clean up the imports after you implement routing
