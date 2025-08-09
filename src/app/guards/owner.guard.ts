import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ArticleService } from "../services/article.service";
import { catchError, combineLatest, map, of, take } from "rxjs";
import { ModalService } from "../services/modal.service";

export const OwnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const articleService = inject(ArticleService);
  const modalService = inject(ModalService);
  const router = inject(Router);

  const articleId = route.paramMap.get("articleId");

  if (!articleId) {
    return router.createUrlTree(["/not-found"]);
  }

  return combineLatest([
    authService.currentUser$.pipe(take(1)),
    articleService.getSingleArticle(articleId).pipe(take(1)),
  ]).pipe(
    map(([user, article]) => {
      if (!user) {
        modalService.openLoginModal();
        return router.createUrlTree(["/"]);
      }

      if (!article) {
        return router.createUrlTree(["/not-found"]);
      }

      if (article.authorId !== user.uid) {
        return router.createUrlTree(["/articles", articleId]);
      }

      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(["/not-found"]));
    })
  );
};
