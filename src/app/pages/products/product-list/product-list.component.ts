import { routes } from './../../../app.routes';
import { Component, ViewChild } from "@angular/core";
import { Product } from "../../../models/products";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { ProductService } from "../../../services/product.service";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
  ],
  providers: [MatTableDataSource],
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent {
  constructor(private productService: ProductService, private router: Router) {}

  displayedColumns: string[] = [
    "code",
    "name",
    "unitPrice",
    "stock",
    "supplierId",
    "categories",
    "edit",
  ];
  productList: Product[] = [];

  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.productList = products;
      this.dataSource.data = products;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.dataSource.data = this.productList;
    } else {
      const filterValueNumber = Number(filterValue);
      this.dataSource.data = this.productList.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          product.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  deleteProduct(product: Product) {
    if (product._id) {
      this.productService.deleteProduct(product._id).subscribe(() => {
        this.loadProducts();
        alert("Produto deletado com sucesso!");
      });
    }
  }
  editProduct(product: Product) {
    this.router.navigate([`/product/edit/${product._id}`]);
  }
}
