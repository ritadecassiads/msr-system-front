import { Component, inject } from '@angular/core';
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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../components/dialog/delete-dialog/delete-dialog.component';
import { Installment } from '../../../models/installment';

@Component({
  selector: "app-invoice-list",
  imports: [MatTableModule, MatPaginatorModule, MatPaginator, MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    CommonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatExpansionModule
  ],
  providers: [MatTableDataSource],
  templateUrl: "./invoice-list.component.html",
  styleUrl: "./invoice-list.component.css"
})
export class InvoiceListComponent {
  invoicesList: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  pageSize = 20;
  currentPage = 0;
  statusFilter = new FormControl();
  statusList: string[] = ["paid", "pending", "overdue"];
  statusMap: { [key: string]: string } = {
    paid: "Pagas",
    pending: "Pendentes",
    overdue: "Vencidas",
  };
  readonly dialog = inject(MatDialog);

  constructor(private invoiceService: InvoiceService, private readonly modalService: ModalMessageService, private readonly router: Router) { }

  ngOnInit() {
    this.loadInvoices();

    this.statusFilter.valueChanges.subscribe((selectedStatus) => {
      this.applyStatusFilter(selectedStatus);
    });
  }

  applyStatusFilter(selectedStatus: string[]): void {
    if (selectedStatus.length === 0) {
      this.filteredInvoices = this.invoicesList;
    } else {
      this.filteredInvoices = this.invoicesList.filter(
        (sale) => sale.status && selectedStatus.includes(sale.status)
      );
    }
  }


  loadInvoices() {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoicesList = invoices;
        this.filteredInvoices = invoices;

        this.sortInvoicesByDate();
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }

  sortInvoicesByDate(): void {
    this.filteredInvoices = [...this.filteredInvoices].sort((a, b) => {
      const statusPriority = this.getStatusPriority(a.status) - this.getStatusPriority(b.status);
  
      if (statusPriority !== 0) {
        return statusPriority;
      }
  
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return dateB - dateA;
    });
  }

  getStatusPriority(status: string): number {
    const priorityMap: { [key: string]: number } = {
      overdue: 1,
      pending: 2,
      paid: 3,    
    };
  
    return priorityMap[status] ?? 4;
  }

  getPagedInvoices() {
    const start = this.currentPage * this.pageSize;
    return this.filteredInvoices.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  editInvoice(invoice: Invoice) {
    this.router.navigate([`/invoice/edit/${invoice._id}`]);
  }

  openModalToConfirmDelete(invoice: Invoice): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { invoice },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (invoice._id) {
          this.deleteInvoice(invoice._id);
        } else {
          console.error("Invoice ID is undefined.");
        }
      }
    });
  }

  deleteInvoice(idInvoice: string) {
    this.invoiceService.deleteInvoice(idInvoice).subscribe({
      next: () => {
        this.modalService.showMessage("Conta excluída com sucesso.", "success");
        this.loadInvoices();
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage("Algo deu errado. Tente novamente.", "error");
      },
    });
  }

  maskAsPaid(invoice: Invoice) {
    invoice.status = "paid";

    this.updateInvoice(invoice);
  }

  maskInstallmentAsPaid(invoice: Invoice, installment: Installment) {
    invoice.installments?.forEach((item) => {
      if (item._id === installment._id) {
        item.status = "paid";
      }
    })

    const allInstallmentsPaid = invoice.installments?.every((item) => item.status === "paid");

    if (allInstallmentsPaid) {
      invoice.status = "paid";
    }

    this.updateInvoice(invoice);
  }

  updateInvoice(invoice: Invoice) {
    this.invoiceService.updateInvoice(invoice).subscribe({
      next: () => {
        this.modalService.showMessage("Registro atualizado.", "success");
        this.loadInvoices();
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage("Algo deu errado. Tente novamente.", "error");
      },
    });
  }

  getStatusFilterText() {
    return (
      this.statusFilter.value
        ?.map((status: string) => this.statusMap[status])
        .join(", ") || ""
    );
  }
}
