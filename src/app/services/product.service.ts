import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}
  // ver como lidar com erros depois
  saveProduct(product: Product) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(`${this.apiUrl}/${product._id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }
}
