import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../models/supplier';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}
  saveSupplier(supplier: Supplier) {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplier(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  updateSupplier(supplier: Supplier) {
    return this.http.patch<Supplier>(`${this.apiUrl}/${supplier._id}`, supplier);
  }

  deleteSupplier(id: string) {
    return this.http.delete<Supplier>(`${this.apiUrl}/${id}`);
  }
}
