import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-theme-toggle-button",
  imports: [],
  templateUrl: "./theme-toggle-button.html",
  styleUrl: "./theme-toggle-button.css",
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
export class ThemeToggleButtonComponent {
  @Input() isDarkMode!: boolean;
  @Input() theme!: "light" | "dark";
  @Input() rotation!: number;
  @Output() toggleTheme = new EventEmitter<void>();

  onClick(): void {
    this.toggleTheme.emit();
  }
}
