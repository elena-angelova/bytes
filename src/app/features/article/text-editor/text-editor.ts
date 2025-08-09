import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Input,
  signal,
  Signal,
  ViewChild,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import type QuillType from "quill";

@Component({
  selector: "app-text-editor",
  imports: [ReactiveFormsModule],
  templateUrl: "./text-editor.html",
  styleUrl: "./text-editor.css",
})
export class TextEditorComponent implements AfterViewInit {
  @Input() content?: Signal<string>;
  @Input() form!: FormGroup;
  @ViewChild("editor", { static: true }) editorContainer!: ElementRef;

  editor!: QuillType;
  editorReadySignal = signal<boolean>(false);

  constructor() {
    effect(() => {
      const contentValue = this.content?.();
      const editorReady = this.editorReadySignal();

      if (!contentValue || !editorReady) return;

      this.editor.setContents(
        this.editor.clipboard.convert({ html: contentValue })
      );
    });
  }

  async ngAfterViewInit() {
    const Quill = (await import("quill")).default;

    this.editor = new Quill(this.editorContainer.nativeElement, {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["link", "blockquote", "code-block"],
          ["code"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
      theme: "snow",
      placeholder: "Tell your story...",
    });

    this.editorReadySignal.set(true);

    const toolbarEl = document.querySelector(".ql-toolbar");
    const toolbarTop =
      (toolbarEl?.getBoundingClientRect().top ?? 0) +
      (document.body.scrollTop || document.documentElement.scrollTop || 0);

    document.body.addEventListener("scroll", () => {
      if (!toolbarEl) return;
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop || 0;

      if (scrollTop > toolbarTop + 1) {
        toolbarEl.classList.add("scrolled");
      } else {
        toolbarEl.classList.remove("scrolled");
      }
    });
  }

  getHtml(): string {
    const textContent = this.editor.getText().trim();
    this.form.get("content")?.setValue(textContent);
    return this.editor.root.innerHTML;
  }
}
