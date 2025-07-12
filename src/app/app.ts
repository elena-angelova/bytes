import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HomePageComponent } from "./pages/home/home";
import { HeaderComponent } from "./features/header/header";
import { FooterComponent } from "./features/footer/footer";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HomePageComponent, HeaderComponent, FooterComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
