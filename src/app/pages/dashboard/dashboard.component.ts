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

@Component({
  selector: "app-dashboard",
  standalone: true,
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
  styleUrl: "./dashboard.component.css",
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
      text: "Ver lista de vendas",
      color: "lightgreen",
      icon: "check_circle",
      link: "/sale/list",
    },
    {
      text: "Acessar conta do cliente",
      color: "#DDBDF1",
      icon: "account_circle",
      link: "/client/list",
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

  constructor(
    private saleService: SaleService,
    private router: Router,
    private invoiceService: InvoiceService,
    private modalService: ModalMessageService
  ) {}

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
}
