import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Timestamp } from "firebase/firestore";

@Component({
  selector: "app-profile-stats",
  imports: [DatePipe],
  templateUrl: "./profile-stats.html",
  styleUrl: "./profile-stats.css",
})
export class ProfileStatsComponent {
  @Input() email: string | null = null;
  @Input() dateJoined: Timestamp | null = null;
  @Input() articleCount: number | null = null;
  @Input() favoriteCategory: string | null = null;
  @Input() totalLikes: number | null = null;
}
