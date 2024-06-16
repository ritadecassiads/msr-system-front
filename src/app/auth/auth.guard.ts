// funciona como protetor das rotas para que so apenas usuarios autenticados acessem - pesquisar mais depois
import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // automatically redirect users to the login page if they attempt to access protected routes without being logged in
  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
