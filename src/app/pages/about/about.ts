import { Component, OnDestroy } from "@angular/core";
import { CtaButtonComponent } from "../../shared/buttons/cta-button/cta-button";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ModalService } from "../../services/modal.service";
import { Subscription, take } from "rxjs";

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
export class AboutPageComponent implements OnDestroy {
  openedIndex: number | null = null;
  private currentUserSub?: Subscription;

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router
  ) {}

  onToggle(index: number): void {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  getIconState(index: number): "opened" | "closed" {
    return this.openedIndex === index ? "opened" : "closed";
  }

  onCtaClick() {
    this.currentUserSub = this.authService.currentUser$
      .pipe(take(1))
      .subscribe((currentUser) => {
        if (currentUser) {
          this.router.navigate(["/articles/create"]);
        } else {
          this.modalService.openRegisterModal();
        }
      });
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }
}
