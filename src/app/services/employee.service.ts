import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}
  saveEmployee(employee: Employee) {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  updateEmployee(employee: Employee) {
    return this.http.patch<Employee>(`${this.apiUrl}/${employee._id}`, employee);
  }

  deleteEmployee(id: string) {
    return this.http.delete<Employee>(`${this.apiUrl}/${id}`);
  }

  getEmployeeByUsername(username: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/username/${username}`);
  }

  getEmployeeByCode(code: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/code/${code}`);
  }
}
