import { Component, inject } from "@angular/core";
import { articleCategories } from "../../config";
import { ArticleMetaComponent } from "./article-meta/article-meta";
import { TextEditorComponent } from "./text-editor/text-editor";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";

@Component({
  selector: "app-article-editor",
  imports: [ReactiveFormsModule, ArticleMetaComponent, TextEditorComponent],
  templateUrl: "./article-editor.html",
  styleUrl: "./article-editor.css",
})
export class ArticleEditorComponent {
  articleCategories: string[] = articleCategories;

  // private formBuilder = inject(FormBuilder);
  // createArticleForm: FormGroup = this.formBuilder.group({
  //   title: new FormControl(),
  //   category: new FormControl(),
  //   thumbnailUrl: new FormControl(),
  //   content: new FormControl(), // *This is updated by the text editor, think how you can deliver the data here
  // });
}
