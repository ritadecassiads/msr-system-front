import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { Invoice } from "../models/invoice";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}
  saveInvoice(invoice: Invoice) {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  updateInvoice(invoice: Invoice) {
    return this.http.patch<Invoice>(`${this.apiUrl}/${invoice._id}`, invoice);
  }

  deleteInvoice(id: string) {
    return this.http.delete<Invoice>(`${this.apiUrl}/${id}`);
  }
}
