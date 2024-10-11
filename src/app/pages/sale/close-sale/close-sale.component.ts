import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SaleListComponent } from '../sale-list/sale-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale';

@Component({
  selector: "app-close-sale",
  standalone: true,
  imports: [
    MatGridListModule,
    MatIcon,
    RouterLink,
    CommonModule,
    SaleListComponent,
    MatExpansionModule,
  ],
  templateUrl: "./close-sale.component.html",
  styleUrl: "./close-sale.component.css",
})
export class CloseSaleComponent implements OnInit {
  saleId!: string;
  sale: Sale = {} as Sale;
  products: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.recoverSaleId();
    this.getSale();
  }

  recoverSaleId() {
    this.saleId = this.route.snapshot.paramMap.get("_id")!;
    console.log("Sale ID:", this.saleId);
    // Aqui você pode buscar os detalhes da venda usando o saleId
  }

  getSale() {
    this.saleService.getSale(this.saleId).subscribe({
      next: (sale) => {
        this.sale = sale;
        this.addMockProducts();
        console.log("Venda:", sale);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  addMockProducts(): void {
    this.products = [
      { id: "p1", code: 1, name: "Produto 1", price: 100, quantity: 2 },
      { id: "p2", code: 2, name: "Produto 2", price: 200, quantity: 1 },
      { id: "p3", code: 3, name: "Produto 3", price: 150, quantity: 2 },
    ];
    this.sale.products = this.products;
  }
}
