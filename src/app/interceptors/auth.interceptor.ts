import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ConfirmDialogComponent } from '../components/dialog/confirm-dialog/confirm-dialog.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService // Serviço de autenticação
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) { // Se o status for Unauthorized
          // Mostrar modal antes de redirecionar
          this.dialog.open(ConfirmDialogComponent, {
            data: { message: 'Sua sessão expirou. Você precisa fazer login novamente.' },
          }).afterClosed().subscribe(result => {
            if (result === 'confirm') {
              this.authService.logout(); // Logout e redirecionar para login
              this.router.navigate(['/login']);
            }
          });
        }
        return throwError(error);
      })
    );
  }
}
