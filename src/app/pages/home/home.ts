import { Component } from "@angular/core";
import { HomeHeroComponent } from "./home-hero/home-hero";

@Component({
  selector: "app-home",
  imports: [HomeHeroComponent],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class HomePageComponent {}
