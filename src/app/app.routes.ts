import { Routes } from "@angular/router";
import { AuthGuard, OwnerGuard } from "./guards";
import { NotFoundComponent } from "./shared/not-found/not-found";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home").then((c) => c.HomePageComponent),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./pages/about/about").then((c) => c.AboutPageComponent),
  },
  {
    path: "privacy-policy",
    loadComponent: () =>
      import("./pages/privacy-policy/privacy-policy").then(
        (c) => c.PrivacyPolicyComponent
      ),
  },
  {
    path: "terms-of-use",
    loadComponent: () =>
      import("./pages/terms-of-use/terms-of-use").then(
        (c) => c.TermsOfUseComponent
      ),
  },
  {
    path: "articles/create",
    loadComponent: () =>
      import("./pages/article-create/article-create").then(
        (c) => c.ArticleCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "articles",
    loadComponent: () =>
      import("./pages/articles/articles").then((c) => c.ArticlesComponent),
  },
  {
    path: "articles/category/:category",
    loadComponent: () =>
      import("./pages/category/category").then((c) => c.CategoryComponent),
  },
  {
    path: "articles/:articleId/edit",
    loadComponent: () =>
      import("./pages/article-edit/article-edit").then(
        (c) => c.ArticleEditComponent
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: "articles/:articleId",
    loadComponent: () =>
      import("./pages/article-details/article-details").then(
        (c) => c.ArticleDetailsComponent
      ),
  },
  {
    path: "users/:userId",
    loadComponent: () =>
      import("./pages/author-details/author-details").then(
        (c) => c.AuthorDetailsComponent
      ),
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./pages/profile-settings/profile-settings").then(
        (c) => c.ProfileSettingsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "reading-list",
    loadComponent: () =>
      import("./pages/reading-list/reading-list").then(
        (c) => c.ReadingListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "search",
    loadComponent: () =>
      import("./pages/search-results/search-results").then(
        (c) => c.SearchResultsComponent
      ),
  },
  { path: "not-found", component: NotFoundComponent },
  { path: "**", redirectTo: "/not-found" },
];
