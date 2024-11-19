import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SaleService } from "../../../services/sale.service";
import { Sale } from "../../../models/sale";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SaleListComponent } from "../sale-list/sale-list.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/products";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-close-sale",
  standalone: true,
  imports: [
    MatGridListModule,
    CommonModule,
    MatExpansionModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
  ],
  providers: [MatTableDataSource],
  templateUrl: "./close-sale.component.html",
  styleUrls: ["./close-sale.component.css"],
})
export class CloseSaleComponent implements OnInit {
  saleId!: string;
  sale: Sale = {} as Sale;
  selectedPaymentMethod: string = "cash";
  amountReceived: number = 0;
  change: number = 0;
  displayedColumns: string[] = ["name", "quantity", "price", "total"];

  dataSource = new MatTableDataSource<Product>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleService: SaleService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.saleId = this.route.snapshot.paramMap.get("_id")!;
    this.loadSaleDetails();
  }

  loadSaleDetails(): void {
    this.saleService.getSale(this.saleId).subscribe((sale) => {
      this.sale = sale;
      this.loadProducts(sale.products);
    });
  }

  loadProducts(productIds: string[]): void {
    const productObservables = productIds.map((productId) =>
      this.productService.getProduct(productId)
    );

    forkJoin(productObservables).subscribe((products) => {
      this.dataSource.data = products;
    });
  }

  calculateChange(): void {
    this.change = this.amountReceived - this.sale.total;
  }

  confirmSale(): void {
    this.sale.status = "close";
    console.log("venda: ", this.sale);
    this.saleService.updateSale({ ...this.sale }).subscribe(() => {
      alert("Venda finalizada!");
      this.router.navigate(["/sales"]);
    });
  }

  cancelSale(): void {
    
  }
}
