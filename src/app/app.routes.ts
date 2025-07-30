import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home/home";
import { AboutPageComponent } from "./pages/about/about";
import { PrivacyPolicyComponent } from "./pages/privacy-policy/privacy-policy";
import { TermsOfUseComponent } from "./pages/terms-of-use/terms-of-use";
import { ArticleCreateComponent } from "./pages/article-create/article-create";
import { ArticlesComponent } from "./pages/articles/articles";
import { CategoryComponent } from "./pages/category/category";
import { AuthorDetailsComponent } from "./pages/author-details/author-details";
import { ArticleDetailsComponent } from "./pages/article-details/article-details";
import { ArticleEditComponent } from "./pages/article-edit/article-edit";
import { ProfileSettingsComponent } from "./pages/profile-settings/profile-settings";
import { ReadingListComponent } from "./pages/reading-list/reading-list";

export const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "about", component: AboutPageComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
  { path: "articles/create", component: ArticleCreateComponent },
  { path: "articles", component: ArticlesComponent },
  { path: "articles/category/:category", component: CategoryComponent },
  { path: "articles/:articleId", component: ArticleDetailsComponent },
  { path: "articles/:articleId/edit", component: ArticleEditComponent },
  { path: "users/:userId", component: AuthorDetailsComponent },
  { path: "settings", component: ProfileSettingsComponent },
  { path: "reading-list", component: ReadingListComponent },
];
