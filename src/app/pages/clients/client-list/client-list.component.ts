import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { MatTableModule } from "@angular/material/table";
import { Client } from "../../../models/client";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
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
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { SaleService } from "../../../services/sale.service";
import { Installment } from "../../../models/installment";
import { Sale } from "../../../models/sale";
import { MatDialog } from "@angular/material/dialog";
import { PaymentDialogComponent } from "../../../components/dialog/payment-dialog/payment-dialog.component";
import { ModalMessageService } from "../../../services/modal-message.service";
import { SharedService } from "../../../shared/services/shared.service";

@Component({
  selector: "app-client-list",
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
  providers: [CurrencyPipe, DatePipe],
  templateUrl: "./client-list.component.html",
  styleUrl: "./client-list.component.css"
})
export class ClientListComponent implements OnInit {
  clientsList: Client[] = [];
  filteredClients: Client[] = [];
  pageSize = 20;
  currentPage = 0;
  expandedClientInfos: { [clientId: string]: boolean } = {};
  // pendingInstallments: Installment[] = [];
  pendingInstallments: { [clientId: string]: Installment[] } = {};
  overdueInstallments: { [clientId: string]: Installment[] } = {};
  salesByClient: { [clientId: string]: Sale[] } = {};

  paidInstallments: Installment[] = [];

  installments!: { saleCode: string; installmentNumber: number; dueDate: string; amount: number; status: string; }[];

  constructor(private clientService: ClientService, private router: Router, private saleService: SaleService, public dialog: MatDialog, private modalService: ModalMessageService, private sharedService: SharedService) { }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe((clients: Client[]) => {
      this.formatClientPhoneNumber(clients);
      this.clientsList = clients;
      this.filteredClients = clients;

    });
  }

  formatClientPhoneNumber(clients: Client[]): void {
    clients.forEach((client) => {
      client.phone = this.sharedService.formatPhoneNumber(client.phone);
    }) 
  }

  initiatePayment(clientId: string, installment: Installment): void {
    let sale = this.getSaleIdFromInstallment(clientId, installment);

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '600px',
      height: '310px',
      data: {
        installment: installment,
        saleId: sale
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modalService.showMessage(
          "Pagamento registrado.",
          "success"
        );
        this.loadClients();
        // window.location.reload();
      }
    });
  }

  refreshPage(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.filteredClients = this.clientsList;
    } else {
      const filterValueNumber = Number(filterValue);

      this.filteredClients = this.clientsList.filter((client) => {
        const matchesName = client.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          client.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPagedClients() {
    const start = this.currentPage * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  editClient(client: Client) {
    this.router.navigate([`/client/edit/${client._id}`]);
  }

  toggleClientInfos(clientId: string): void {
    this.expandedClientInfos[clientId] = !this.expandedClientInfos[clientId];
  }

  isClientInfosExpanded(clientId: string): boolean {
    return this.expandedClientInfos[clientId];
  }

  async getSalesByClient(clientId: string) {
    this.clientService.getSalesByClient(clientId).subscribe({
      next: (sales) => {
        this.salesByClient[clientId] = sales;

        this.getInstallments(clientId, sales);
      },
      error: (error) => {
        console.error("Error fetching sales: ", error);
      }
    })
  }

  getInstallments(clientId: string, sales: Sale[]) {
    const allInstallments: Installment[] = [];

    if (sales.length > 0) {
      sales.forEach((sale) => {
        allInstallments.push(...(sale.installments ?? []));
      })
    }
    this.pendingInstallments[clientId] = allInstallments.filter(i => i.status === 'pending');
    this.overdueInstallments[clientId] = allInstallments.filter(i => i.status === 'overdue');
    // this.paidInstallments[clientId] = allInstallments.filter(i => i.status === 'paid');
  }

  getSaleIdFromInstallment(clientId: string, installment: Installment): string {
    const sales = this.salesByClient[clientId] ?? [];
    let saleId: string = '';

    sales.forEach((sale) => {
      if (sale.installments?.some(inst => inst._id === installment._id)) {
        saleId = sale._id ?? '';
      }
    })

    return saleId;
  }
}
