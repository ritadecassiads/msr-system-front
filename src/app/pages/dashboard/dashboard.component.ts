import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { SaleListComponent } from "../sale/sale-list/sale-list.component";
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/sale';
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    MatGridListModule,
    MatIcon,
    RouterLink,
    CommonModule,
    SaleListComponent,
    MatExpansionModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  salesList: Sale[] = [];

  buttonTiles = [
    {
      text: "Abrir venda",
      color: "lightblue",
      icon: "shopping_cart",
      link: "/sale/register",
    },
    {
      text: "Fechar venda",
      color: "lightgreen",
      icon: "check_circle",
      link: "/product/list",
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
        this.salesList = sales;
        console.log("vendas: ", sales);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  navigateToCloseSale(saleId: string): void {
    this.router.navigate(["/sale/close", saleId]);
  }
}
