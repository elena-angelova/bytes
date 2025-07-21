import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home/home";
import { AboutPageComponent } from "./pages/about/about";
import { PrivacyPolicyComponent } from "./pages/privacy-policy/privacy-policy";
import { TermsOfUseComponent } from "./pages/terms-of-use/terms-of-use";
import { RegisterModalComponent } from "./modals/register/register";
import { LoginModalComponent } from "./modals/login/login";
import { ArticleEditorComponent } from "./pages/article-editor/article-editor";
import { ArticlesComponent } from "./pages/articles/articles";
import { CategoryComponent } from "./pages/category/category";
import { AuthorDetailsComponent } from "./pages/author-details/author-details";

export const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "about", component: AboutPageComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
  { path: "register", component: RegisterModalComponent },
  { path: "login", component: LoginModalComponent },
  { path: "articles/create", component: ArticleEditorComponent },
  { path: "articles", component: ArticlesComponent },
  { path: "articles/:id", component: AboutPageComponent }, // !Change this once the article details component is ready
  { path: "category/:category", component: CategoryComponent },
  { path: "users/:userId", component: AuthorDetailsComponent },
];
