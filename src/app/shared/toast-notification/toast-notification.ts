import { Component, Input } from "@angular/core";

@Component({
  selector: "app-toast-notification",
  imports: [],
  templateUrl: "./toast-notification.html",
  styleUrl: "./toast-notification.css",
})
export class ToastNotificationComponent {
  @Input() textContent!: string;
}
