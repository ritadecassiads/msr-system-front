import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}
  saveCategory(category: Category) {
    return this.http.post<Category>(this.apiUrl, category);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  updateCategory(category: Category) {
    return this.http.patch<Category>(`${this.apiUrl}/${category._id}`, category);
  }

  deleteCategory(id: string) {
    return this.http.delete<Category>(`${this.apiUrl}/${id}`);
  }
}
