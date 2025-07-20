import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home/home";
import { AboutPageComponent } from "./pages/about/about";
import { PrivacyPolicyComponent } from "./pages/privacy-policy/privacy-policy";
import { TermsOfUseComponent } from "./pages/terms-of-use/terms-of-use";
import { RegisterModalComponent } from "./modals/register/register";
import { LoginModalComponent } from "./modals/login/login";
import { ArticleEditorComponent } from "./pages/article-editor/article-editor";

export const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "about", component: AboutPageComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
  { path: "register", component: RegisterModalComponent },
  { path: "login", component: LoginModalComponent },
  { path: "articles/create", component: ArticleEditorComponent },
  { path: "articles/:id", component: AboutPageComponent }, // !Change this once the article details component is ready
];
