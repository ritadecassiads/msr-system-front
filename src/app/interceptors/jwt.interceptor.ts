import { AuthService } from "./../services/auth.service";
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { ConfirmDialogComponent } from "../components/dialog/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
// intercepta todas as requisições HTTP que passam por ele
export const JwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Injeta o serviço de dialog
  const dialog = inject(MatDialog);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = sessionStorage.getItem("access_token");

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned).pipe(
      catchError((error) => {
        // Verifica se o erro é um Unauthorized (token expirado ou inválido)
        if (error.status === 401) {
          console.log("Sessão expirada");
          // Mostra a modal de confirmação
          const dialogRef = dialog.open(ConfirmDialogComponent, {
            data: {
              message:
                "Sua sessão expirou. Você precisa fazer login novamente.",
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirm") {
              // Chama o serviço de logout
              authService.logout(); // Limpa o token e dados do usuário
              // Redireciona para a tela de login
              router.navigate(["/login"]);
            }
          });
        }

        return throwError(error);
      })
    );
  }
  return next(req);
};
