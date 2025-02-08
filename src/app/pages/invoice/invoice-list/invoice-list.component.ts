import { Component } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Invoice } from '../../../models/invoice';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModalMessageService } from '../../../services/modal-message.service';

@Component({
  selector: "app-invoice-list",
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatPaginator],
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
}
