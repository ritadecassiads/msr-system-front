import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Sale } from "../models/sale";
import { Observable } from "rxjs";
import { Installment } from "../models/installment";

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
    console.log("API ", this.apiUrl);
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  updateSale(sale: Sale) {
    return this.http.patch<Sale>(`${this.apiUrl}/${sale._id}`, sale);
  }

  updateInstallment(saleId: string, installment: Installment){
    return this.http.patch<Installment>(`${this.apiUrl}/${saleId}/installment`, installment);
  }

  deleteSale(id: number) {
    return this.http.delete<Sale>(`${this.apiUrl}/${id}`);
  }
}
