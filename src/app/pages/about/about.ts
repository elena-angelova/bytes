import { Component } from "@angular/core";
import { CtaButtonComponent } from "../../ui/buttons/cta-button/cta-button";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "app-about",
  imports: [CtaButtonComponent],
  templateUrl: "./about.html",
  styleUrl: "./about.css",
  animations: [
    trigger("iconToggle", [
      state("opened", style({ transform: "rotate(180deg)" })),
      state("closed", style({ transform: "rotate(0deg)" })),
      transition("opened <=> closed", [animate("400ms ease-in-out")]),
    ]),
  ],
})
export class AboutPageComponent {
  openedIndex: number | null = null;

  onToggle(index: number): void {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  getIconState(index: number): "opened" | "closed" {
    return this.openedIndex === index ? "opened" : "closed";
  }
}
