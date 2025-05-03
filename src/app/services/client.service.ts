import { Injectable } from "@angular/core";
import { Client } from "../models/client";
import { environment } from "../../enviroments/enviroments";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Sale } from "../models/sale";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;
  constructor(private http: HttpClient) {}

  saveClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error saving client:  ", error);
       return throwError(() => new Error('Error occurred while saving client'));
      })
    );
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClient(id: string) {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  getSalesByClient(clientId: string): Observable<Sale[]> {
    console.log("clientId: ", clientId);
    return this.http.get<Sale[]>(`${this.apiUrl}/${clientId}/installments`);
  }

  updateClient(client: Client) {
    return this.http.patch<Client>(`${this.apiUrl}/${client._id}`, client);
  }

  deleteClient(id: number) {
    return this.http.delete<Client>(`${this.apiUrl}/${id}`);
  }
}
