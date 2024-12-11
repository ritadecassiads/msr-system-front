import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { SaleListComponent } from "../sale/sale-list/sale-list.component";
import { SaleService } from "../../services/sale.service";
import { Sale } from "../../models/sale";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";

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
  ],
  providers: [MatTableDataSource],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  salesList: Sale[] = [];
  displayedColumns: string[] = [
    "employeeName",
    "quantity",
    "total",
    "status",
    "arrow",
  ];

  buttonTiles = [
    {
      text: "Abrir venda",
      color: "lightblue",
      icon: "shopping_cart",
      link: "/open-sale",
    },
    {
      text: "Fechar venda",
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

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit(): void {
    this.getSales();
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
     return sales.filter((sale) => sale.status !== "closed");
  }

  navigateToCloseSale(saleId: string): void {
    this.router.navigate(["/sale/close", saleId]);
  }
}
