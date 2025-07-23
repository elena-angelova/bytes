import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home/home";
import { AboutPageComponent } from "./pages/about/about";
import { PrivacyPolicyComponent } from "./pages/privacy-policy/privacy-policy";
import { TermsOfUseComponent } from "./pages/terms-of-use/terms-of-use";
import { ArticleEditorComponent } from "./pages/article-editor/article-editor";
import { ArticlesComponent } from "./pages/articles/articles";
import { CategoryComponent } from "./pages/category/category";
import { AuthorDetailsComponent } from "./pages/author-details/author-details";
import { ArticleDetailsComponent } from "./pages/article-details/article-details";

export const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "about", component: AboutPageComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
  { path: "articles/create", component: ArticleEditorComponent },
  { path: "articles", component: ArticlesComponent },
  { path: "articles/:articleId", component: ArticleDetailsComponent },
  { path: "articles/category/:category", component: CategoryComponent },
  { path: "users/:userId", component: AuthorDetailsComponent },
  { path: "settings", component: AboutPageComponent }, // !Change this once the settings component is ready
];
