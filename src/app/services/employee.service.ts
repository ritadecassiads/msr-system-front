import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private http: HttpClient) {}

  saveEmployee(employee: Employee) {
    console.log("employee -->", employee);
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getEmployees() {
    return this.http.get(this.apiUrl);
  }
}
