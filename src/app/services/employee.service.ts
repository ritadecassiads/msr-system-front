import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { environment } from '../../enviroments/enviroments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private http: HttpClient) {}
  // ver como lidar com erros depois
  saveEmployee(employee: Employee) {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  updateEmployee(employee: Employee) {
    return this.http.put<Employee>(`${this.apiUrl}/${employee._id}`, employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete<Employee>(`${this.apiUrl}/${id}`);
  }

  getEmployeeByUsername(username: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/username/${username}`);
  }

  getEmployeeByCode(code: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/code/${code}`);
  }
}
