import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
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
    MatCardSubtitle
  ],
  templateUrl: "./sale-register.component.html",
  styleUrl: "./sale-register.component.css",
})
export class SaleRegisterComponent {
  saleForm: FormGroup = new FormGroup({});
  productList: Product[] = [];
  filteredProducts: Product[] = [];
  // productsControl = new FormControl([], Validators.required);
  usernameShared: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private saleService: SaleService,
    private sharedService: SharedService
  ) {}

  displayedColumns: string[] = ["code", "name", "price", "quantity"];

  ngOnInit() {
    this.getProducts();
    this.formInit();
    this.recoverUser();
  }

  get products(): FormArray {
    return this.saleForm.get("products") as FormArray;
  }

  get totalPrice(): number {
    return this.saleForm.get("totalPrice")?.value;
  }

  set totalPrice(value: number) {
    this.saleForm.get("totalPrice")?.setValue(value);
  }

  set quantity(value: number) {
    this.saleForm.get("quantity")?.setValue(value);
  }

  updateTotal(): void {
    this.totalPrice = this.products.controls.reduce(
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
    const totalQuantity = this.products.controls.reduce(
      (quantityAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        return quantityAccumulator + productQuantity;
      },
      0
    );
    console.log("totalQuantity: ", totalQuantity);
    this.quantity = totalQuantity;
  }

  onSubmit() {
    console.log("saleForm: ", this.saleForm.value);

    if (this.saleForm.valid) {
      const sale: Sale = this.saleForm.value;
      this.saleService.saveSale(sale).subscribe({
        next: (sale) => {
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

  formInit() {
    this.saleForm = this.fb.group({
      products: this.fb.array([], Validators.required),
      clientId: [""],
      sellerId: ["", Validators.required],
      quantity: ["", Validators.required],
      totalPrice: ["", Validators.required],
      observations: [""],
    });
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    console.log("filterValue: ", filterValue);

    this.filteredProducts = this.productList.filter((product) =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  addProduct(product: any): void {
    const productGroup = this.fb.group({
      productId: [product.id, Validators.required],
      name: [product.name],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [product.price],
    });
    this.products.push(productGroup);
    this.updateTotal();
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    this.updateTotal();
  }

  recoverUser() {
     this.usernameShared = this.sharedService.getUsername();
     this.saleForm.get("sellerId")?.setValue(this.usernameShared);
  }
}
