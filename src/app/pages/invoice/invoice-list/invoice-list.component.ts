import { Component } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Invoice } from '../../../models/invoice';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModalMessageService } from '../../../services/modal-message.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-invoice-list",
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, MatButtonModule,
      MatIconModule,
      // MatDatepickerModule,
      MatCard,
      MatCardHeader,
      MatCardTitle,
      MatCardContent,
      MatCardSubtitle,
      CommonModule,
      MatSelectModule,
      FormsModule,
      ReactiveFormsModule],
  providers: [MatTableDataSource],
  templateUrl: "./invoice-list.component.html",
  styleUrl: "./invoice-list.component.css",
})
export class InvoiceListComponent {
  constructor(private invoiceService: InvoiceService, private readonly modalService: ModalMessageService) {}

  displayedColumns: string[] = [
    "code",
    "amount",
    "installments",
    "installmentAmounts",
    "issueDate",
    "dueDate",
    "supplierId",
    "notes",
  ];

  dataSource = new MatTableDataSource<Invoice>();

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.dataSource.data = invoices;
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }

  applyFilter(event: Event): void {
    // const filterValue = (event.target as HTMLInputElement).value
    //   .trim()
    //   .toLowerCase();

    // if (filterValue === "") {
    //   this.filteredEmployees = this.employeesList;
    // } else {
    //   const filterValueNumber = Number(filterValue);

    //   this.filteredEmployees = this.employeesList.filter((employee) => {
    //     const matchesName = employee.name.toLowerCase().includes(filterValue);
    //     const matchesCode =
    //       !isNaN(filterValueNumber) &&
    //       employee.code?.toString().includes(filterValue);
    //     return matchesName || matchesCode;
    //   });
    // }
  }
}
