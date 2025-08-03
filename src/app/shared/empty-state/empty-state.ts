import { Component, Input, OnInit } from "@angular/core";
import { CtaButtonComponent } from "../buttons/cta-button/cta-button";
import { Router } from "@angular/router";
import { ModalService } from "../../services/modal.service";

@Component({
  selector: "app-empty-state",
  imports: [CtaButtonComponent],
  templateUrl: "./empty-state.html",
  styleUrl: "./empty-state.css",
})
export class EmptyStateComponent implements OnInit {
  @Input() isOwner?: boolean;
  @Input() isLoggedIn?: boolean;

  subheading: string =
    "This space is still quiet. Be the dev who breaks the silence.";

  constructor(private router: Router, private modalService: ModalService) {}

  ngOnInit(): void {
    if (this.isOwner) {
      this.subheading =
        "Just an empty page with endless potential. Ready to begin?";
    } else if (this.isOwner === false) {
      this.subheading = "They might be cooking up something. Check back soon.";
    }
  }

  onCtaClick() {
    if (this.isLoggedIn) {
      this.router.navigate(["/articles/create"]);
    } else {
      this.modalService.openLoginModal();
    }
  }
}
