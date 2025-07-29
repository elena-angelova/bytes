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
  @Input() displayName!: string | null;
  @Input() email!: string | null;
  @Input() dateJoined!: Timestamp;
  @Input() articleCount!: number;
  @Input() favoriteCategory!: string;
  @Input() totalLikes!: number;
}
