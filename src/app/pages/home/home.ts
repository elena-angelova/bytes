import { Component, OnInit } from "@angular/core";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home",
  imports: [CtaButtonComponent, RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class HomePageComponent implements OnInit {
  line1: string = "Your dev story,";
  line2Part1: string = "in ";
  line2Part2: string = "bytes"; // Highlighted color

  displayedLine1: string = "";
  displayedLine2Part1: string = "";
  displayedLine2Part2: string = "";

  currentLine: number = 1;

  // Part 1 = "in "; Part 2 = "bytes"
  currentPart: number = 1;
  currentIndex: number = 0;

  // Typing speed in ms
  speedInMs: number = 150;

  ngOnInit(): void {
    this.typeText();
  }

  // Type one character at a time
  typeText(): void {
    // First line
    if (this.currentLine === 1) {
      // Check if there are still characters left to type in line 1
      if (this.currentIndex < this.line1.length) {
        this.displayedLine1 += this.line1.charAt(this.currentIndex);
        this.currentIndex++;
        setTimeout(() => this.typeText(), this.speedInMs);
      } else {
        // Move to line 2, part 1
        this.currentLine = 2;
        this.currentPart = 1;
        this.currentIndex = 0;
        setTimeout(() => this.typeText(), this.speedInMs * 3); // Pause a bit before line 2
      }
      // Second line
    } else if (this.currentLine === 2) {
      // First part of second line ("in ")
      if (this.currentPart === 1) {
        if (this.currentIndex < this.line2Part1.length) {
          this.displayedLine2Part1 += this.line2Part1.charAt(this.currentIndex);
          this.currentIndex++;
          setTimeout(() => this.typeText(), this.speedInMs);
        } else {
          // Move to part 2
          this.currentPart = 2;
          this.currentIndex = 0;
          setTimeout(() => this.typeText(), this.speedInMs);
        }
        // Second part of second line ("bytes")
      } else if (this.currentPart === 2) {
        if (this.currentIndex < this.line2Part2.length) {
          this.displayedLine2Part2 += this.line2Part2.charAt(this.currentIndex);
          this.currentIndex++;
          setTimeout(() => this.typeText(), this.speedInMs);
        }
      }
    }
  }
}
