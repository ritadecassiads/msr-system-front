import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
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

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  updateCategory(category: Category) {
    return this.http.put<Category>(`${this.apiUrl}/${category._id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete<Category>(`${this.apiUrl}/${id}`);
  }
}
