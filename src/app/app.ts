import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./features/header/header";
import { FooterComponent } from "./features/footer/footer";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {}
