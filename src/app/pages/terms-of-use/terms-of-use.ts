import { Component } from "@angular/core";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-terms-of-use",
  imports: [RouterLink, SectionTitleComponent],
  templateUrl: "./terms-of-use.html",
  styleUrl: "./terms-of-use.css",
})
export class TermsOfUseComponent {}
