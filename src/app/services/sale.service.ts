import { Injectable } from "@angular/core";
import { environment } from "../../enviroments/enviroments";
import { HttpClient } from "@angular/common/http";
import { Sale } from "../models/sale";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SaleService {
  private apiUrl = `${environment.apiBaseUrl}/sales`;

  constructor(private http: HttpClient) {}
  // ver como lidar com erros depois
  saveSale(sale: Sale) {
    return this.http.post<Sale>(this.apiUrl, sale);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  updateSale(sale: Sale) {
    return this.http.put<Sale>(`${this.apiUrl}/${sale._id}`, sale);
  }

  deleteSale(id: number) {
    return this.http.delete<Sale>(`${this.apiUrl}/${id}`);
  }
}
