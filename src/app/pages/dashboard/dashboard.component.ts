import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MatGridListModule, MatIcon, RouterLink, CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  tiles = [
    {
      text: "Abrir venda",
      color: "lightblue",
      icon: "shopping_cart",
      link: "/product/list",
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
      link: "/product/list",
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
}
