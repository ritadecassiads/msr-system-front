import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTableDataSource } from "@angular/material/table";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee";

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatPaginator],
  providers: [MatTableDataSource],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.css",
})
export class EmployeeListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "code",
    "name",
    "username",
    "cpf",
    "phone",
    "email",
    "isAdmin",
    "address",
  ];
  
  dataSource = new MatTableDataSource<Employee>();

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.dataSource.data = data;
    });
  }
}
