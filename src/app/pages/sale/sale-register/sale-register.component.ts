import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
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
import { MatTableModule } from "@angular/material/table";
import { SharedService } from "../../../shared/services/shared.service";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee";
import { catchError, map, Observable } from "rxjs";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-sale-register",
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
    MatOption,
    MatSelectModule,
    MatList,
    MatListItem,
    CurrencyPipe,
    MatTableModule,
    MatCardSubtitle,
    MatIcon,
  ],
  templateUrl: "./sale-register.component.html",
  styleUrl: "./sale-register.component.css",
})
export class SaleRegisterComponent {
  saleForm: FormGroup = new FormGroup({});
  productList: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProducts: FormArray = this.fb.array([]);
  usernameShared: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private saleService: SaleService,
    private sharedService: SharedService,
    private employeeService: EmployeeService
  ) {}

  displayedColumns: string[] = ["code", "name", "quantity", "price", "delete"];

  ngOnInit() {
    this.getProducts();
    this.formInit();
    this.recoverUser();
    this.getSellerByUsername(this.usernameShared);
  }

  get products(): FormArray {
    return this.saleForm.get("products") as FormArray;
  }

  get total(): number {
    return this.saleForm.get("total")?.value;
  }

  set total(value: number) {
    this.saleForm.get("total")?.setValue(value);
  }

  set quantity(value: number) {
    this.saleForm.get("quantity")?.setValue(value);
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.productList = products;
      },
      error: (err) => {
        console.error(err);
        alert("Error loading products. Please try again.");
      },
    });
  }

  formInit() {
    this.saleForm = this.fb.group({
      products: this.fb.array([], Validators.required),
      openedByEmployee: ["", Validators.required],
      quantity: ["", Validators.required],
      total: ["", Validators.required],
    });
  }

  recoverUser() {
    this.usernameShared = this.sharedService.getUsername();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.filteredProducts = [];
    } else {
      const filterValueNumber = Number(filterValue);
      this.filteredProducts = this.productList.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          product.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  addProduct(product: Product): void {
    this.products.push(this.fb.control(product._id, Validators.required));

    const productGroup = this.fb.group({
      _id: [product._id, Validators.required],
      code: [product.code],
      name: [product.name],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [product.price],
    });

    this.selectedProducts.push(productGroup);
    this.updateTotal();

    console.log("Selected products ids: ", this.selectedProducts);
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.selectedProducts.removeAt(index);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.selectedProducts.controls.reduce(
      (totalAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        const productPrice = productControl.get("price")?.value || 0;
        return totalAccumulator + productQuantity * productPrice;
      },
      0
    );
    this.updateQuantity();
  }

  updateQuantity(): void {
    this.quantity = this.selectedProducts.controls.reduce(
      (quantityAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        return quantityAccumulator + productQuantity;
      },
      0
    );
  }

  onSubmit() {
    const sale: Sale = this.saleForm.value;
    console.log("Sale form enviado API: ", sale);

    if (this.saleForm.valid) {
      this.saleService.saveSale(sale).subscribe({
        next: (data) => {
          console.log("Sale registered successfully: ", data);
          alert("Sale registered successfully.");
          //this.router.navigate(["/sales"]);
        },
        error: (err) => {
          console.error(err);
          alert("Error registering sale. Please try again.");
        },
      });
    } else {
      alert("Please fill in all required fields.");
    }
  }

  getSellerByUsername(username: string): void {
    if (this.usernameShared) {
      this.employeeService.getEmployeeByUsername(username).subscribe({
        next: (employee) => {
          this.saleForm.get("openedByEmployee")?.setValue(employee._id);
          //this.usernameShared = employee.name;
        },
        error: (err) => {
          console.log("Error loading employee. Please try again.");
        },
      });
    } else {
      // abrir a modal para coletar o username
    }
  }
}
