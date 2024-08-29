import { Component } from '@angular/core';
import { Product } from '../../../models/products';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatPaginator],
  providers: [MatTableDataSource],
  templateUrl: "./product-list.component.html",
  styleUrl: "./product-list.component.css",
})
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  displayedColumns: string[] = [
    "code",
    "name",
    "description",
    "price",
    "stock",
    "supplierId",
    "categories",
  ];

  dataSource = new MatTableDataSource<Product>();

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.dataSource.data = data;
      console.log("listagem --> ", this.dataSource.data);
    });
  }
}
