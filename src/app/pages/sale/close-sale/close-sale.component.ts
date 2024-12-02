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
import { SaleProduct } from "../../../models/sale-product";

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
  displayedColumns: string[] = ["name", "quantity", "unitPrice", "totalPrice"];
  todayDate: string = this.getTodayDate();

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
      if (sale.status === "closed") {
        alert("Venda já finalizada!");
        // this.router.navigate(["/dashboard"]);
        return;
      }
      this.sale = sale;
      // this.loadProducts(sale.products);
    });
  }

  // ver necessidade de refatorar essa parte
  // loadProducts(productIds: SaleProduct[]): void {
  //   const productObservables = productIds
  //     .filter((productId) => productId._id !== undefined)
  //     .map((productId) => this.productService.getProduct(productId._id!));

  //   forkJoin(productObservables).subscribe((products) => {
  //     this.dataSource.data = products;
  //   });
  // }

  calculateChange(): void {
    this.change = this.amountReceived - this.sale.total;
  }

  confirmSale(): void {
    this.sale.status = "closed";
    this.sale.paymentMethod = this.selectedPaymentMethod as any;

    console.log("venda: ", this.sale);
    this.saleService.updateSale({ ...this.sale }).subscribe(() => {
      alert("Venda finalizada!");
    });
  }

  cancelSale(): void {}

  getTodayDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
