import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatOption } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router, RouterModule } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/products";
import { Sale } from "../../../models/sale";
import { SaleService } from "../../../services/sale.service";
import { MatList, MatListItem } from "@angular/material/list";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SharedService } from "../../../shared/services/shared.service";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee";
import { catchError, map, Observable } from "rxjs";
import { MatIcon } from "@angular/material/icon";
import { StorageUtils } from "../../../shared/utils/storage-utils";
import { MatDialog } from "@angular/material/dialog";
import { InputUserDialogComponent } from "../../../components/dialog/input-user-dialog/input-user-dialog.component";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: "app-open-sale",
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    CommonModule,
    MatSelectModule,
    MatPaginatorModule,
    CurrencyPipe,
    MatTableModule,
    MatCardSubtitle,
    MatIcon,
  ],
  templateUrl: "./open-sale.component.html",
  styleUrl: "./open-sale.component.css",
})
export class SaleRegisterComponent {
  saleForm: FormGroup = new FormGroup({});
  productList: Product[] = [];
  // filteredProducts: Product[] = [];
  selectedProducts: FormArray = this.fb.array([]);
  employeeUsername: string = "";
  displayedColumns: string[] = [
    "code",
    "name",
    "productQuantity",
    "unitPrice",
    "totalPrice",
    "stock",
    "delete",
  ];
  isProductListVisible: boolean = true;
  labelButton: string = "Esconder";

  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private saleService: SaleService,
    private sharedService: SharedService,
    private employeeService: EmployeeService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
  }

  ngOnInit() {
    this.openModalToColectUsername();
    this.getProducts();
    this.saleFormInit();
  }

  get saleProducts(): FormArray {
    return this.saleForm.get("products") as FormArray;
  }

  set saleProducts(products: FormArray) {
    this.saleForm.setControl("products", products);
  }

  get total(): number {
    return this.saleForm.get("total")?.value;
  }

  set total(value: number) {
    this.saleForm.get("total")?.setValue(value);
  }

  get itensQuantity(): number {
    return this.saleForm.get("itensQuantity")?.value;
  }

  set itensQuantity(value: number) {
    this.saleForm.get("itensQuantity")?.setValue(value);
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productList = this.filteredProductsByStock(products);
        this.dataSource.data = this.productList;
      },
      error: (err) => {
        console.error(err);
        alert("Error loading products. Please try again.");
      },
    });
  }

  saleFormInit() {
    this.saleForm = this.fb.group({
      products: this.fb.array([], Validators.required),
      openedByEmployee: ["", Validators.required],
      itensQuantity: [0, Validators.required],
      total: [0, Validators.required],
    });
  }

  recoverUser() {
    this.employeeUsername = StorageUtils.getUserSale() ?? "";
    console.log("Username shared: ", this.employeeUsername);
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

  addProduct(product: Product): void {
    if (!this.isProductInSale(product)) {
      const productGroup = this.fb.group({
        _id: [product._id, Validators.required],
        code: [product.code, Validators.required],
        name: [product.name, Validators.required],
        quantity: [1, Validators.required],
        unitPrice: [product.price, Validators.required],
        totalPrice: [product.price, Validators.required],
        stock: [product.stock, Validators.required],
      });

      this.saleProducts.push(productGroup);
      this.itensQuantity = 1;

      this.updateTotal();
    }
  }

  isProductInSale(product: Product): boolean {
    return this.saleProducts.controls.some(
      (control) => control.value.code === product.code
    );
  }

  removeProduct(index: number): void {
    this.saleProducts.removeAt(index);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.saleProducts.controls.reduce(
      (totalAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        const unitPrice = productControl.get("unitPrice")?.value || 0;
        const totalPrice = productQuantity * unitPrice;

        productControl.get("totalPrice")?.setValue(totalPrice);

        return totalAccumulator + totalPrice;
      },
      0
    );

    this.updateItensQuantity();
  }

  updateItensQuantity(): void {
    this.itensQuantity = this.saleProducts.controls.reduce(
      (quantityAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        return quantityAccumulator + productQuantity;
      },
      0
    );
  }

  decrementQuantity(index: number): void {
    let quantity = this.saleProducts.at(index).get("quantity")?.value;
    if (quantity == 1) {
      return;
    }
    this.saleProducts
      .at(index)
      .get("quantity")
      ?.setValue(quantity - 1);

    this.updateTotal();
  }

  incrementQuantity(index: number): void {
    let quantity = this.saleProducts.at(index).get("quantity")?.value;
    if (quantity >= this.saleProducts.at(index).get("stock")?.value) {
      return;
    }
    this.saleProducts
      .at(index)
      .get("quantity")
      ?.setValue(quantity + 1);

    this.updateTotal();
  }

  onSubmit() {
    const sale: Sale = this.saleForm.value;
    console.log("Sale form enviado API: ", sale);

    if (this.saleForm.valid) {
      this.saleService.saveSale(sale).subscribe({
        next: (data) => {
          alert("Sale registered successfully.");
          StorageUtils.clearUserSale();

          this.router.navigate(["/dashboard"]);
        },
        error: (err) => {
          console.error(err);
          alert("Error registering sale. Please try again.");
        },
      });
    } else {
      if (this.saleForm.get("openedByEmployee")?.invalid) {
        this.openModalToColectUsername();
      }
      alert("Please fill in all required fields.");
    }
  }

  openModalToColectUsername(): void {
    const dialogRef = this.dialog.open(InputUserDialogComponent, {
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeUsername = result;
        this.getSellerByUsername();
        StorageUtils.setUserSale(result);
      }
    });
  }

  getSellerByUsername(): void {
    console.log("recuperando user do banco: ", this.employeeUsername);
    if (this.employeeUsername) {
      this.employeeService
        .getEmployeeByUsername(this.employeeUsername)
        .subscribe({
          next: (employee) => {
            this.saleForm.get("openedByEmployee")?.setValue(employee._id);
            //this.employeeUsername = employee.name;
          },
          error: (err) => {
            if (err.status === 404) {
              console.error("Employee not found (404).");
              alert(
                "Vendedor não encontrado. Por favor, insira um nome de vendedor válido."
              );
              this.openModalToColectUsername();
            } else {
              console.error("Error loading employee. Please try again.");
              alert("Error loading employee. Please try again.");
            }
          },
        });
    }
  }

  toggleProductListVisibility(): void {
    this.isProductListVisible = !this.isProductListVisible;
    this.labelButton = this.isProductListVisible ? "Esconder" : "Mostrar";
  }

  filteredProductsByStock(products: Product[]): Product[] {
    return products.filter((product) => product.stock > 0);
  }
}
