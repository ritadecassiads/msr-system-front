import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Sale } from "../models/sale";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}
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
    return this.http.patch<Sale>(`${this.apiUrl}/${sale._id}`, sale);
  }

  deleteSale(id: number) {
    return this.http.delete<Sale>(`${this.apiUrl}/${id}`);
  }
}
