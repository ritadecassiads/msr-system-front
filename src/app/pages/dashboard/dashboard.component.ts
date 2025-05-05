import { InvoiceService } from "./../../services/invoice.service";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { SaleService } from "../../services/sale.service";
import { Sale } from "../../models/sale";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { Invoice } from "../../models/invoice";
import { ModalMessageService } from "../../services/modal-message.service";
import { LoaderComponent } from "../../components/loader/loader.component";
import { LoaderService } from "../../services/loader.service";
import { Installment } from "../../models/installment";

@Component({
  selector: "app-dashboard",
  imports: [
    MatGridListModule,
    MatIcon,
    RouterLink,
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [MatTableDataSource],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css"
})
export class DashboardComponent implements OnInit {
  salesList: Sale[] = [];
  displayedColumns: string[] = [
    "code",
    "employeeName",
    "quantity",
    "total",
    "arrow",
  ];

  displayedColumnsInvoices: string[] = [
    "issueDate",
    "supplierId",
    "installments",
    "installmentAmounts",
    "notes",
  ];

  buttonTiles = [
    {
      text: "Abrir venda",
      color: "lightblue",
      icon: "shopping_cart",
      link: "/open-sale",
    },
    {
      text: "Acessar conta do cliente",
      color: "#DDBDF1",
      icon: "account_circle",
      link: "/client/list",
    },
    {
      text: "Ver lista de vendas",
      color: "lightgreen",
      icon: "check_circle",
      link: "/sale/list",
    },
    {
      text: "Fechar caixa",
      color: "lightpink",
      icon: "account_balance",
      link: "/product/list",
    },
    {
      text: "Acessar produto",
      color: "#DDBDF1",
      icon: "add_circle",
      link: "/product/list",
    },
  ];

  invoiceList: Invoice[] = [];
  supplierName: string[] = [];

  isLoading$ = this.loaderService.isLoading$;


  constructor(
    private saleService: SaleService,
    private router: Router,
    private invoiceService: InvoiceService,
    private modalService: ModalMessageService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.getSales();
    this.getInvoices();
  }

  getSales() {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        this.salesList = this.filteredSalesByStatus(sales);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  filteredSalesByStatus(sales: Sale[]): Sale[] {
    return sales
      .filter((sale) => sale.status !== "closed" && sale.status !== "canceled")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  navigateToCloseSale(saleId: string): void {
    this.router.navigate(["/sale/close", saleId]);
  }

  navigateToSaleList(): void {
    this.router.navigate(["/sale/list"]);
  }

  getInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoiceList = invoices;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  navigateToInvoiceList(): void {
    this.router.navigate(["/invoice/list"]);
  }

  navigateToInvoiceRegister(): void {
    this.router.navigate(["/invoice/register"]);
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
        this.getInvoices();
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
}
