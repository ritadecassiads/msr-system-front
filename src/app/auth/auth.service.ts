import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TokenJwt } from "../models/tokenJwt";
import { inject } from "@angular/core";
import { tap } from "rxjs/operators";
import { User } from "../models/user";

@Injectable({ providedIn: "root" })

export class AuthService {
  httpClient = inject(HttpClient);
  private apiUrl = "http://localhost:3000/auth";

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
        map((response) => {
          if (response && response.token_jwt) {
            localStorage.setItem("authUser", response.token_jwt);
          }
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem("authUser");
  }

  isLoggedIn() {
    return localStorage.getItem("authUser") !== null;
  }

  // mudar para user: User
  register(data: any) {
    return this.httpClient.post(`${this.apiUrl}/register`, data);
  }
}
