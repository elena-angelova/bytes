import { Component } from "@angular/core";
import { CtaButtonComponent } from "../../../ui/buttons/cta-button/cta-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home-hero",
  imports: [RouterLink, CtaButtonComponent],
  templateUrl: "./home-hero.html",
  styleUrl: "./home-hero.css",
})
export class HomeHeroComponent {}
