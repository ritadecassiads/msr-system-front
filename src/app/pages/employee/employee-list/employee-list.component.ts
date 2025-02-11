import { AfterViewInit, Component, inject, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { Router } from "@angular/router";
import { DeleteDialogComponent } from "../../../components/dialog/delete-dialog/delete-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ModalMessageService } from "../../../services/modal-message.service";

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.css",
})
export class EmployeeListComponent implements OnInit {
  employeesList: Employee[] = [];
  filteredEmployees: Employee[] = [];
  pageSize = 20;
  currentPage = 0;
  readonly dialog = inject(MatDialog);

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly router: Router,
    private readonly modalService: ModalMessageService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe((data: Employee[]) => {
      this.employeesList = data;
      this.filteredEmployees = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.filteredEmployees = this.employeesList;
    } else {
      const filterValueNumber = Number(filterValue);

      this.filteredEmployees = this.employeesList.filter((employee) => {
        const matchesName = employee.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          employee.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPagedEmployees() {
    const start = this.currentPage * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  editEmployee(employee: Employee) {
    this.router.navigate([`/employee/edit/${employee._id}`]);
  }

  openModalToConfirmDelete(employee: Employee): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { employee },
      restoreFocus: false,
    });

    // afterClosed retorna um Observable que é chamado quando o modal é fechado, result é o valor passado no close da modal
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        // this.deleteEmployee(product);
      }
    });
  }

  deleteEmployee(employee: Employee) {
    if(employee._id){
      this.employeeService.deleteEmployee(employee._id).subscribe(() => {
        this.loadEmployees();
        this.modalService.showMessage("Cadastro de funcionário deletado.", "success");
      });
    }
  }

  formatPhone(phone: string): string {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
}
