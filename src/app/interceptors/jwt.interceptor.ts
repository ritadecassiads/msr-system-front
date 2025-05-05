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
        if (error.status === 401) {
          const dialogRef = dialog.open(ConfirmDialogComponent, {
            data: {
              message:
                "Sua sessão expirou. Você precisa fazer login novamente.",
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result === "confirm") {
              authService.logout();
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
