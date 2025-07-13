import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home/home";
import { AboutPageComponent } from "./pages/about/about";
import { PrivacyPolicyComponent } from "./pages/privacy-policy/privacy-policy";
import { TermsOfUseComponent } from "./pages/terms-of-use/terms-of-use";

export const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "about", component: AboutPageComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-use", component: TermsOfUseComponent },
];
