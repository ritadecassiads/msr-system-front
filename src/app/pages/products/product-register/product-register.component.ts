import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/products";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { CategoryService } from "../../../services/category.service";
import { Category } from "../../../models/category";
import { SupplierService } from "../../../services/supplier.service";
import { Supplier } from "../../../models/supplier";

@Component({
  selector: "app-product-register",
  standalone: true,
  templateUrl: "./product-register.component.html",
  styleUrl: "./product-register.component.css",
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
    MatSelectModule,
    MatOption,
    CommonModule,
  ],
})
export class ProductRegisterComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService
  ) {}

  supplierList: Supplier[] = [];
  supplierControl = new FormControl("", Validators.required);
  categoryList: Category[] = [];
  categoriesControl = new FormControl([], Validators.required);

  ngOnInit() {
    this.getCategories();
    this.getSuppliers();
    this.formInit();
    this.initializeCategoryControl();
    this.onChangeSupplierControl();
  }

  get categories(): FormArray {
    return this.productForm.get("categories") as FormArray;
  }

  get supplier(): AbstractControl<any, any> | null {
    return this.productForm.get("supplier");
  }

  onChangeSupplierControl(): void {
    this.supplierControl.valueChanges.subscribe((selectedSupplier) => {
      console.log("selectedSupplier: ", selectedSupplier);
      this.productForm.get("supplierId")?.setValue(selectedSupplier);
    });
  }

  initializeCategoryControl(): void {
    this.categoriesControl.valueChanges.subscribe((selectedCategories) => {
      return this.setCategories(selectedCategories || []);
    });
  }

  setCategories(selectedCategories: string[]): void {
    this.categories.clear();
    selectedCategories.forEach((category) => {
      this.categories.push(new FormControl(category, Validators.required));
    });
  }

  getCategories() {
    return this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categoryList = data;
      },
      error: (err) => {
        console.log("Error response:", err.response);
        alert("Error loading categories. Please try again.");
      },
    });
  }

  getSuppliers() {
    return this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.supplierList = data;
      },
      error: (err) => {
        console.log("Error response:", err.response);
        alert("Error loading suppliers. Please try again.");
      },
    });
  }

  formInit() {
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      description: "",
      price: ["", Validators.required],
      stock: ["", Validators.required],
      supplierId: ["", Validators.required],
      categories: this.fb.array([], Validators.required), // Inicializa como FormArray,
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      console.log("prduto: ", product);

      this.productService.saveProduct(product).subscribe({
        next: (data) => {
          alert("Product registered!");
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => {
          console.error(err);
          console.log("Error response:", err.response); // Print the response
          alert("Error registering product. Please check your data.");
        },
      });
    } else {
      alert("Please fill in all required fields.");
    }
  }
}
