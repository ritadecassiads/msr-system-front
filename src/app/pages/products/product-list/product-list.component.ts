import { routes } from "./../../../app.routes";
import { Component, inject, ViewChild } from "@angular/core";
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
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../../../components/dialog/delete-dialog/delete-dialog.component";
import { ModalMessageService } from "../../../services/modal-message.service";

@Component({
    selector: "app-product-list",
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
    styleUrl: "./product-list.component.css"
})
export class ProductListComponent {
  constructor(
    private productService: ProductService,
    private router: Router,
    private readonly modalService: ModalMessageService
  ) {}

  readonly dialog = inject(MatDialog);

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
      this.productList = this.sortProducts(products);
      this.dataSource.data = this.productList;
    });
  }

  sortProducts(products: Product[]) {
    return products.sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? 0).getTime();
      return dateB - dateA;
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
        this.modalService.showMessage("Produto deletado.", "success");
      });
    }
  }

  editProduct(product: Product) {
    this.router.navigate([`/product/edit/${product._id}`]);
  }

  getCategoriesName(product: Product): string {
    return product.categories.map((category) => category.name).join(", ");
  }

  openModalToConfirmDelete(product: Product): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { product },
      restoreFocus: false,
    });

    // afterClosed retorna um Observable que é chamado quando o modal é fechado, result é o valor passado no close da modal
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.deleteProduct(product);
      }
    });
  }
}
