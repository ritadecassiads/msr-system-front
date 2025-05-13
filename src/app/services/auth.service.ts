import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { TokenJwt } from "../models/tokenJwt";
import { inject } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: "root" })
export class AuthService {
  httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    return this.http
      .post<TokenJwt>(
        `${this.apiUrl}/login`,
        { username, password },
        { headers }
      )
      .pipe(
        // pipe permite que você encadeie múltiplos operadores RxJS, criando um pipeline de processamento para o fluxo de dados do observable
        map((response) => {
          if (response && response.access_token) {
            sessionStorage.setItem("access_token", response.access_token);
          }
          return response;
        }),
        // lida com erros que ocorrem durante a execução do Observable
        catchError((error) => {
          // Handle errors (e.g., show an error message to the user)
          console.error("Login error:", error);
          // Retornar um Observable com o erro para que o fluxo possa ser tratado
          return throwError(() => new Error("An error occurred during login."));
        })
      );
  }

  logout() {
    sessionStorage.removeItem("access_token");
  }

  isLoggedIn() {
    return sessionStorage.getItem("access_token") !== null;
  }

  getLoggedUser() {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      return null;
    }
    const [, payload] = token.split("."); // composto por três partes separadas por pontos (.): header, payload, e signature
    const decodedPayload = atob(payload); // decodifica a string base64
    const jsonUser = JSON.parse(decodedPayload);
    const idUserLogged = jsonUser.sub;
    
    return idUserLogged;
  }
}
