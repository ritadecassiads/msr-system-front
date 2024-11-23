import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
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
import { StorageUtils } from "../../../shared/utils/storage-utils";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../../components/dialog/dialog.component";

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
    MatSelectModule,

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

  readonly dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private saleService: SaleService,
    private sharedService: SharedService,
    private employeeService: EmployeeService
  ) {}

  displayedColumns: string[] = [
    "code",
    "name",
    "itensQuantity",
    "unitPrice",
    "totalPrice",
    "delete",
  ];

  ngOnInit() {
    this.getProducts();
    this.saleFormInit();
    this.recoverUser();
    this.getSellerByUsername();
  }

  get products(): FormArray {
    return this.saleForm.get("products") as FormArray;
  }

  set products(products: FormArray) {
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
        this.productList = products;
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
      itensQuantity: ["", Validators.required],
      total: ["", Validators.required],
    });
  }

  recoverUser() {
    this.usernameShared = StorageUtils.getUserSale() ?? "";
    console.log("Username shared: ", this.usernameShared);
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
    const productGroup = this.fb.group({
      _id: [product._id, Validators.required],
      code: [product.code, Validators.required],
      name: [product.name, Validators.required],
      quantity: [1, Validators.required],
      unitPrice: [product.price, Validators.required],
      totalPrice: [product.price, Validators.required],
    });

    this.products.push(productGroup);

    console.log("Product added: ", productGroup.value);

    this.updateTotal();
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
    // this.selectedProducts.removeAt(index);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.products.controls.reduce(
      (totalAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        const unitPrice = productControl.get("unitPrice")?.value || 0;
        const totalPrice = productQuantity * unitPrice;

        // Atualize o campo totalPrice de cada item
        productControl.get("totalPrice")?.setValue(totalPrice);

        return totalAccumulator + totalPrice;
      },
      0
    );

    this.updateItensQuantity();
  }

  updateItensQuantity(): void {
    const totalQuantity = this.products.controls.reduce(
      (quantityAccumulator, productControl) => {
        const productQuantity = productControl.get("quantity")?.value || 0;
        return quantityAccumulator + productQuantity;
      },
      0
    );

    this.itensQuantity = totalQuantity;

    console.log("Quantidade total: ", this.itensQuantity);
  }

  updateUnitQuantity(index: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const quantity = parseInt(inputElement.value, 10);

    if (!isNaN(quantity) && quantity > 0) {
      this.products.at(index).get("quantity")?.setValue(quantity);
      this.updateTotal();
    }

    console.log(
      "Quantidade do item atualizada: ",
      this.products.at(index).value
    );

    this.updateItensQuantity();
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

  openModalToColectUsername(): void {
    if(!this.usernameShared){
      const dialogRef = this.dialog.open(DialogComponent, {
        restoreFocus: false,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log("Username salvo:", result);
          StorageUtils.setUserSale(result);
        }
      });
    }
  }

  getSellerByUsername(): void {
  console.log("recuperando user do banco: ", this.usernameShared);
    if (this.usernameShared) {
      this.employeeService
        .getEmployeeByUsername(this.usernameShared)
        .subscribe({
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
