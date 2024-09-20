import { Injectable } from "@angular/core";
import { environment } from "../../enviroments/enviroments";
import { HttpClient } from "@angular/common/http";
import { Invoice } from "../models/invoice";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  private apiUrl = `${environment.apiBaseUrl}/invoices`;

  constructor(private http: HttpClient) {}
  // ver como lidar com erros depois
  saveInvoice(invoice: Invoice) {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  updateInvoice(invoice: Invoice) {
    return this.http.put<Invoice>(`${this.apiUrl}/${invoice._id}`, invoice);
  }

  deleteInvoice(id: number) {
    return this.http.delete<Invoice>(`${this.apiUrl}/${id}`);
  }
}
