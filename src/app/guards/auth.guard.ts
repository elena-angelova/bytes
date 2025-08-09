import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, take } from "rxjs";
import { inject } from "@angular/core";
import { ModalService } from "../services/modal.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        modalService.openLoginModal();
        return router.createUrlTree(["/"]);
      }
    })
  );
};
