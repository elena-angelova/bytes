import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CtaButtonComponent } from "../../../ui/buttons/cta-button/cta-button";

@Component({
  selector: "app-article-meta",
  imports: [CtaButtonComponent],
  templateUrl: "./article-meta.html",
  styleUrl: "./article-meta.css",
})
export class ArticleMetaComponent {
  @Input() articleCategories!: string[];
  @Input() fileName!: string;

  // *Consider moving this logic to the ArticleEditorComponent
  @ViewChild("titleTextarea") textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.resizeTitleField();
  }

  resizeTitleField() {
    const el = this.textarea.nativeElement;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  // *
}
